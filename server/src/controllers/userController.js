const User = require('../models/User');

exports.registerUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      res.status(401);
      throw new Error('Login failed! Check the credentials');
    }
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  res.json(req.user);
};
