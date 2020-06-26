const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { mailgunConfig } = require('../config/services/mailgun');

const mg = mailgunConfig();

/*
  Helpful resource: https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
*/

const {
  usePasswordHashToMakeToken,
  getPasswordResetURL,
  resetPasswordTemplate,
} = require('../utils/email');

exports.sendPasswordResetEmail = async (req, res, next) => {
  if (typeof req.body.email === 'undefined') {
    return res.status(400).json({ message: 'Email is required' });
  }

  const { email } = req.body;

  let user;
  try {
    user = await User.findOne({ email }).exec();
    /*
      "Always indicate success when the user enters their email address in the forgotten-password page."
    */
    if (!user) {
      return res.status(200).json({
        message: 'Success! Check your email inbox and follow the steps',
      });
    }
  } catch (err) {
    return next(err);
  }

  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);

  const sendEmail = () => {
    mg.messages().send(emailTemplate, (err, body) => {
      if (err) {
        return res.status(400).json({ message: 'Unable to send email' });
      }
      return res.json({
        body,
        message: 'Success! Check your email inbox and follow the steps',
      });
    });
  };

  sendEmail();
};

exports.receiveNewPassword = async (req, res, next) => {
  if (typeof req.body.password === 'undefined') {
    return res.status(400).json({ message: 'Password is required' });
  }

  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'No user with that email found' });
    }

    const secret = user.password + '-' + user.createdAt.getTime();

    jwt.verify(token, secret, (err, payload) => {
      if (err || !payload) {
        return res.status(401).json({ message: 'Unable to verify the user' });
      }

      if (payload && payload.userId !== user.id) {
        return res.status(401).json({ message: 'Unable to verify the user' });
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          User.findByIdAndUpdate(userId, { password: hash })
            .then(() => {
              return res
                .status(202)
                .json({ message: 'Successfully changed password' });
            })
            .catch((err) => next(err));
        });
      });
    });
  } catch (err) {
    return next(err);
  }
};
