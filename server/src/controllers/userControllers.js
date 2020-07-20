const User = require('../models/User');
const Blog = require('../models/Blog');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const { dataUri } = require('../middleware');
const { uploader } = require('../services/cloudinary');

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

    return res.json({ user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res) => {
  return res.json({ user: req.user });
};

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

    // Remove old avatar from cloudinary
    if (req.user.avatar && req.user.avatar.image_url) {
      await deleteImageFromCloudinary(
        req.user.avatar.image_url,
        'bloggingplatform'
      );
    }

    return res.json({ avatarURL: user.avatar.image_url });
  } catch (err) {
    next(err);
  }
};

exports.deleteAvatar = async (req, res, next) => {
  try {
    if (req.user.avatar && req.user.avatar.image_url) {
      await deleteImageFromCloudinary(
        req.user.avatar.image_url,
        'bloggingplatform'
      );

      req.user.avatar = {};
      await req.user.save();
    }

    return res.json({ message: 'Successfully deleted user avatar' });
  } catch (err) {
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    if (req.user.avatar && req.user.avatar.image_url) {
      await deleteImageFromCloudinary(
        req.user.avatar.image_url,
        'bloggingplatform'
      );
    }

    const blogs = await Blog.find({ user: req.user._id }).select('bgImg');
    // TODO: Specjalnie nie czekasz na usunięcie tych obrazków?
    blogs.forEach(async (blog) => {
      if (blog.bgImg && blog.bgImg.image_url) {
        await deleteImageFromCloudinary(
          blog.bgImg.image_url,
          'bloggingplatform'
        );
      }
    });
    await Blog.deleteMany({ user: req.user._id });

    const posts = await Post.find({ user: req.user._id }).select('bgImg');
    posts.forEach(async (post) => {
      if (post.bgImg && post.bgImg.image_url) {
        await deleteImageFromCloudinary(
          post.bgImg.image_url,
          'bloggingplatform'
        );
      }
    });
    await Post.deleteMany({ user: req.user._id });

    return res.json({ message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
};
