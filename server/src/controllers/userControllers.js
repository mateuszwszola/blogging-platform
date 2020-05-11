const { validationResult } = require('express-validator');
const User = require('../models/User');
const Photo = require('../models/Photo');
const errorFormatter = require('../validations/errorFormatter');
const {
  convertBufferToJimpImg,
  resizeAndOptimizeImg,
} = require('../utils/optimizeImg');

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

  if (Object.prototype.hasOwnProperty.call(req.body, 'bio')) {
    newUserData.bio = req.body.bio;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
    newUserData.name = req.body.name;
  }

  try {
    if (Object.keys(newUserData).length === 0) {
      return res.json({ user: req.user });
    }
    
    const newUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
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

    const user = await User.findById(req.user.id);

    // delete old photo
    if (user.photo) {
      await Photo.findByIdAndDelete(user.photo);
    }

    user.photo = photo.id;

    await user.save();

    res.json({ photoId: photo.id });
  } catch (err) {
    res.status(err.status || 422);
    next(err);
  }
};
