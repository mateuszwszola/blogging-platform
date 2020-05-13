const { validationResult } = require('express-validator');
const User = require('../models/User');
const Photo = require('../models/Photo');
const errorFormatter = require('../validations/errorFormatter');
const {
  convertBufferToJimpImg,
  resizeAndOptimizeImg,
} = require('../utils/optimizeImg');
const createPhotoLink = require('../utils/createPhotoLink');

exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (err) {
    res.status(401);
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const newUserData = {};

  if ('name' in req.body) {
    newUserData.name = req.body.name;
  }

  if ('bio' in req.body) {
    newUserData.bio = req.body.bio;
  }

  try {
    const newUser = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
    });
    res.json({ user: newUser });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getUser = async (req, res) => {
  res.json({ user: req.user });
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('cannot upload photo');
    }

    const img = await convertBufferToJimpImg(req.file.buffer);
    const buffer = await resizeAndOptimizeImg(img, 300, undefined, 90);

    const photo = await Photo.create({ photo: buffer });

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar.photoID) {
      // delete old photo
      await Photo.findByIdAndDelete(user.avatar.photoID);
    }

    user.avatar.photoURL = createPhotoLink(photo.id);
    user.avatar.photoID = photo.id;

    await user.save();

    res.json({ photoURL: user.avatar.photoURL });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
