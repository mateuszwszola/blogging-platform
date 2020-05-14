const Blog = require('../models/Blog');
const User = require('../models/User');
const Photo = require('../models/Photo');
const createPhotoLink = require('../utils/createPhotoLink');
const { ErrorHandler } = require('../utils/error');

exports.createBlog = async (req, res, next) => {
  const { name } = req.body;

  try {
    const blog = await Blog.findOne({ name });
    if (blog) {
      throw new ErrorHandler(400, `blog '${name}' already exists`);
    }

    const blogData = { user: req.user._id, name, bgImg: {} };

    if (typeof req.body.description !== 'undefined') {
      blogData.description = req.body.description;
    }

    if (typeof req.body.bgImgUrl !== 'undefined') {
      blogData.bgImg.photoURL = req.body.bgImgUrl;
      blogData.bgImg.photoID = null;
    }

    if (typeof req.body.imgAttribution !== 'undefined') {
      blogData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    const file = req.file && req.file.buffer;
    if (file && !blogData.bgImg.photoURL) {
      const photo = await Photo.create({
        photo: req.file.buffer,
      });

      blogData.bgImg.photoID = photo.id;
      blogData.bgImg.photoURL = createPhotoLink(photo.id);
    }

    const newBlog = await Blog.create({ ...blogData });

    res.status(201).json({ blog: newBlog });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.blogId,
      user: req.user._id,
    });

    if (!blog) {
      throw new ErrorHandler(404, 'Blog Not Found');
    }

    const blogData = { name: req.body.name, bgImg: {} };

    if (typeof req.body.description !== 'undefined') {
      blogData.description = req.body.description;
    }

    if (typeof req.body.bgImgUrl !== 'undefined') {
      blogData.bgImg.photoURL = req.body.bgImgUrl;
      blogData.bgImg.photoID = null;
    }

    if (typeof req.body.imgAttribution !== 'undefined') {
      blogData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    const newPhoto = req.file && req.file.buffer;

    if (
      blog.bgImg &&
      blog.bgImg.photoID &&
      (blogData.bgImg.photoURL || newPhoto)
    ) {
      // delete old photo
      await Photo.findByIdAndDelete(blog.bgImg.photoID);
    }

    if (newPhoto) {
      const photo = await Photo.create({
        photo: newPhoto,
      });

      blogData.bgImg.photoID = photo.id;
      blogData.bgImg.photoURL = createPhotoLink(photo.id);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      blogData,
      { new: true }
    );

    res.status(200).json({ blog: updatedBlog });
  } catch (err) {
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    if (!blog) {
      res.status(404);
      throw new Error('Blog Not Found');
    }
    res.json({ blog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getBlogBySlugName = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug }).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    if (!blog) {
      res.status(404);
      throw new Error('Blog Not Found');
    }
    res.json({ blog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAuthUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId }).populate(
      'user',
      ['name', 'bio', 'avatar']
    );
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      res.status(404);
      throw new Error('Blog Not Found');
    }
    const user = await User.findById(req.user._id);
    if (!blog.user.equals(user.id)) {
      res.status(401);
      throw new Error('You are not authorized to access this resource');
    }

    await Blog.findByIdAndDelete(req.params.blogId);
    res.status(201).json({ message: 'OK' });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
