const jwt = require('jsonwebtoken');
const config = require('../config');

exports.usePasswordHashToMakeToken = ({
  password: passwordHash,
  _id: userId,
  createdAt,
}) => {
  const secret = passwordHash + '-' + createdAt.getTime();
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 3600, // 1 hour
  });
  return token;
};

exports.getPasswordResetURL = (user, token) => {
  return `${config.corsOrigin}/resetpassword/${user._id}/${token}`;
};

exports.resetPasswordTemplate = (user, url) => {
  const from = 'Blogging Platform <blogging-platform@samples.mailgun.org>';
  const to = `${user.name} <${user.email}>`;
  const subject = 'Blogging Platform Password Reset 🙈';
  const html = `
    <p>Hey ${user.name}!</p>

    <p>We heard that you lost the password to Blogging Platform</p>
    <p>If you made a request use the following link to reset your password</p>
    <a href=${url}>${url}</a>
    <p>The link will expire in 1 hour</p>

    <p>- Your friends at Blogging Platform</p>
  `;

  return {
    from,
    to,
    subject,
    html,
  };
};
