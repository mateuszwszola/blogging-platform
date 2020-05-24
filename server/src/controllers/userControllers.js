const User = require('../models/User');
const Photo = require('../models/Photo');
const {
  convertBufferToJimpImg,
  resizeAndOptimizeImg,
} = require('../utils/optimizeImg');
const createPhotoLink = require('../utils/createPhotoLink');
const { ErrorHandler } = require('../utils/error');

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

    if (typeof req.body.avatarURL !== 'undefined') {
      newUserData.avatar = {};
      newUserData.avatar.photoURL = req.body.avatarURL;
      newUserData.avatar.photoID = null;
    }

    if (
      newUserData.avatar &&
      newUserData.avatar.photoURL &&
      user.avatar &&
      user.avatar.photoID
    ) {
      // delete old, uploaded avatar
      await Photo.findByIdAndDelete(user.avatar.photoID);
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

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ErrorHandler(400, 'cannot upload photo');
    }

    const img = await convertBufferToJimpImg(req.file.buffer);
    const buffer = await resizeAndOptimizeImg(img, 300, undefined, 90);

    const photo = await Photo.create({ photo: buffer });

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    if (user.avatar && user.avatar.photoID) {
      // delete old photo
      await Photo.findByIdAndDelete(user.avatar.photoID);
    }

    user.avatar.photoURL = createPhotoLink(photo.id);
    user.avatar.photoID = photo.id;

    await user.save();

    res.json({ photoURL: user.avatar.photoURL });
  } catch (err) {
    next(err);
  }
};
