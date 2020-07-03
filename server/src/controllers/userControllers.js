const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const { dataUri } = require('../middleware/multer');
const { uploader } = require('../services/cloudinary');

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

  try {
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

    const image = dataUri(req).content;
    const result = await uploader.upload(image, {
      upload_preset: 'bloggingplatform-avatar',
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: { image_url: result.secure_url } },
      { new: true }
    );

    // TODO: remove old avatar
    if (req.user.avatar && req.user.avatar.image_url) {
      await deleteImageFromCloudinary(
        user.avatar.image_url,
        'bloggingplatform-avatar'
      );
    }

    res.json({ avatarURL: user.avatar.image_url });
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
