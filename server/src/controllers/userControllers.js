const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');
const deleteS3Object = require('../utils/s3/deleteS3Object');
const getObjectKeyFromImageUrl = require('../utils/s3/getObjectKeyFromImageUrl');

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    const newUserData = {};

    if (typeof req.body.name !== 'undefined') {
      newUserData.name = req.body.name;
    }

    if (typeof req.body.bio !== 'undefined') {
      newUserData.bio = req.body.bio;
    }

    const newUser = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });

    res.json({ user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res) => {
  res.json({ user: req.user });
};

// eslint-disable-next-line
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ErrorHandler(400, 'cannot upload photo');
    }

    if (req.user.avatar) {
      // delete old avatar
      await deleteS3Object(getObjectKeyFromImageUrl(req.user.avatar));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.location },
      { new: true }
    );

    res.json({ photoURL: user.avatar });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
