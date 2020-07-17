const { User } = require('../models');
const AuthService = require('../services/auth');

const authServiceInstance = new AuthService(User);

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const { user, token } = await authServiceInstance.Signup({
      name,
      email,
      password,
    });

    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await authServiceInstance.Signin({
      email,
      password,
    });

    return res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    await authServiceInstance.ChangePassword(
      req.user.email,
      currentPassword,
      newPassword
    );

    return res.status(200).json({ message: 'Password successfully updated!' });
  } catch (err) {
    next(err);
  }
};
