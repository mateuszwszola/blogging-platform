const User = require('../models/User');

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = await user.generateAuthToken();

    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByCredentials(req.user.email, currentPassword);
    if (!user) {
      return res
        .status(422)
        .json({ errors: { currentPassword: 'Invalid credentials' } });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password successfully updated!' });
  } catch (err) {
    next(err);
  }
};
