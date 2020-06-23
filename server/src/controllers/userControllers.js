const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');
const deleteS3Object = require('../utils/s3/deleteS3Object');

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
  const newUserData = {};

  if (typeof req.body.name !== 'undefined') {
    newUserData.name = req.body.name;
  }

  if (typeof req.body.bio !== 'undefined') {
    newUserData.bio = req.body.bio;
  }

  if (typeof req.body.avatarURL !== 'undefined') {
    newUserData.avatar = {};
    newUserData.avatar.url = req.body.avatarURL;
  }

  try {
    if (
      typeof newUserData.avatar !== 'undefined' &&
      req.user.avatar &&
      req.user.avatar.s3Key
    ) {
      await deleteS3Object(req.user.avatar.s3Key);
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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: { url: req.file.location, s3Key: req.file.key } },
      { new: true }
    );

    if (req.user.avatar && req.user.avatar.s3Key) {
      // delete old avatar from S3
      await deleteS3Object(req.user.avatar.s3Key);
    }

    res.json({ avatarURL: user.avatar.url });
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
