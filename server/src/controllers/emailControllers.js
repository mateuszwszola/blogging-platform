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

  const user = await User.findOne({ email }).exec();
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

  await mg.messages().send(emailTemplate);

  return res.status(200).json({
    message: 'Success! Check your email inbox and follow the steps',
  });
};

exports.receiveNewPassword = async (req, res) => {
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

  const payload = await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (
        err ||
        !payload ||
        (payload && payload.userId.toString() !== user.id.toString())
      ) {
        reject(new ErrorHandler(400, 'Unable to verify the user'));
      } else {
        resolve(payload);
      }
    });
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.findByIdAndUpdate(payload.userId, { password: hash }).exec();

  return res.status(202).json({ message: 'Successfully changed password' });
};
