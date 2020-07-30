const { User, Blog, Post } = require('../models');
const { ErrorHandler } = require('../utils/error');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const { dataUri } = require('../middleware');
const { uploader } = require('../services/cloudinary');

exports.updateUser = async (req, res) => {
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

  return res.json({ user: newUser });
};

exports.getUser = async (req, res) => {
  return res.json({ user: req.user });
};

exports.uploadPhoto = async (req, res) => {
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

  res.json({ avatarURL: user.avatar.image_url });

  if (req.user.avatar && req.user.avatar.image_url) {
    await deleteImageFromCloudinary(
      req.user.avatar.image_url,
      'bloggingplatform'
    );
  }
};

exports.deleteAvatar = async (req, res) => {
  req.user.avatar = {};
  await req.user.save();
  res.json({ message: 'Successfully deleted user avatar' });

  if (req.user.avatar && req.user.avatar.image_url) {
    await deleteImageFromCloudinary(
      req.user.avatar.image_url,
      'bloggingplatform'
    );
  }
};

exports.deleteAccount = async (req, res) => {
  const { _id: userId } = req.user;

  // Store blogs and posts bg images before delete
  const [blogs, posts] = await Promise.all([
    Blog.find({ user: userId }).select('bgImg').exec(),
    Post.find({ user: userId }).select('bgImg').exec(),
    User.findByIdAndDelete(userId).exec(),
  ]);

  await Promise.all([
    Blog.deleteMany({ user: req.user._id }).exec(),
    Post.deleteMany({ user: req.user._id }).exec(),
  ]);

  res.json({ message: 'Account deleted' });

  // Remove images from cloudinary
  await Promise.all([
    ...blogs.map(async (blog) => {
      if (blog.bgImg && blog.bgImg.image_url) {
        await deleteImageFromCloudinary(
          blog.bgImg.image_url,
          'bloggingplatform'
        );
      }
    }),
    ...posts.map(async (post) => {
      if (post.bgImg && post.bgImg.image_url) {
        await deleteImageFromCloudinary(
          post.bgImg.image_url,
          'bloggingplatform'
        );
      }
    }),
    req.user.avatar && req.user.avatar.image_url
      ? deleteImageFromCloudinary(req.user.avatar.image_url, 'bloggingplatform')
      : null,
  ]);
};
