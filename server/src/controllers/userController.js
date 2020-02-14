const { validationResult } = require('express-validator');
const User = require('../models/User');

const validationResultOptions = { onlyFirstError: true };


exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array(validationResultOptions) });
  }

  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array(validationResultOptions) });
  }

  const { email, password } = req.body;

  try {
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

// eslint-disable-next-line no-unused-vars
exports.getUser = async (req, res, next) => {
  res.json(req.user);
};

exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(({ token }) => token !== req.token);
    await req.user.save();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
