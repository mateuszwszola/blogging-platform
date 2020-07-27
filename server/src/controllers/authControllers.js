const { User } = require('../models');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  const token = await user.generateAuthToken();

  return res.status(201).json({ user, token });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByCredentials(email, password);
  const token = await user.generateAuthToken();

  return res.json({ user, token });
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByCredentials(req.user.email, currentPassword);
  user.password = newPassword;
  await user.save();

  return res.status(200).json({ message: 'Password successfully updated!' });
};
