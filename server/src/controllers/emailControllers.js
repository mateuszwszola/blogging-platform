const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mg = require('../config/mailgun');

const {
  usePasswordHashToMakeToken,
  getPasswordResetURL,
  resetPasswordTemplate,
} = require('../utils/email');

exports.sendPasswordResetEmail = async (req, res, next) => {
  const { email } = req.params;

  let user;
  try {
    user = await User.findOne({ email }).exec();
  } catch (err) {
    return res.status(404).json({ message: 'No user with that email' });
  }

  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);

  const sendEmail = () => {
    mg.messages().send(emailTemplate, (err, body) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: 'Unable to send email' });
      }
      return res.json({ body });
    });
  };

  sendEmail();
};

exports.receiveNewPassword = async (req, res, next) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    const secret = user.password + '-' + user.createdAt;
    const payload = jwt.decode(token, secret);

    if (payload.userId !== user.id) {
      throw new Error('Invalid user');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(userId, { password: hash });

    return res.status(202).json({ message: 'Successfully changed password' });
  } catch (err) {
    res.status(err.status || 404);
    next(err);
  }
};
