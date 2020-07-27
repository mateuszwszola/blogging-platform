const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { mailgunConfig } = require('../services/mailgun');
const { ErrorHandler } = require('../utils/error');

const mg = mailgunConfig();

/*
  Helpful resource: https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
*/

const {
  usePasswordHashToMakeToken,
  getPasswordResetURL,
  resetPasswordTemplate,
} = require('../utils/email');

exports.sendPasswordResetEmail = async (req, res) => {
  if (typeof req.body.email === 'undefined') {
    throw new ErrorHandler(400, 'Email is required');
  }

  const { email } = req.body;

  let user;

  user = await User.findOne({ email }).exec();
  /*
      "Always indicate success when the user enters their email address in the forgotten-password page."
    */
  if (!user) {
    return res.status(200).json({
      message: 'Success! Check your email inbox and follow the steps',
    });
  }

  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);

  const sendEmail = () => {
    mg.messages().send(emailTemplate, (err, body) => {
      if (err) {
        throw new ErrorHandler(400, 'Unable to send email');
      }
      return res.status(200).json({
        message: 'Success! Check your email inbox and follow the steps',
      });
    });
  };

  sendEmail();
};

exports.receiveNewPassword = async (req, res, next) => {
  if (typeof req.body.password === 'undefined') {
    throw new ErrorHandler(400, 'Password is required');
  }

  const { userId, token } = req.params;
  const { password } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorHandler(400, 'Unable to verify the user');
  }

  const secret = user.password + '-' + user.createdAt.getTime();

  // TODO: jak już korzystasz z async/await to sugerowałbym być raczej spójny i przy tym zostać czyli
  //  new Promise() dla jwt bo bcrypt ma wsparcie
  jwt.verify(token, secret, (err, payload) => {
    if (err || !payload) {
      return res.status(400).json({ message: 'Unable to verify the user' });
    }

    if (payload && payload.userId !== user.id) {
      return res.status(400).json({ message: 'Unable to verify the user' });
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
};
