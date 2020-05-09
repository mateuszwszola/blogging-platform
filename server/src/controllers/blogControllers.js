const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Photo = require('../models/Photo');
const errorFormatter = require('../validations/errorFormatter');

exports.createBlog = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { name, description } = req.body;

  try {
    const blog = await Blog.findOne({ name });
    if (blog) {
      res.status(400);
      throw new Error(`blog '${name}' already exists`);
    }

    const blogData = { name, description };
    const optionalFields = ['bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (field in req.body) {
        blogData[field] = req.body[field];
      }
    });

    const newBlog = new Blog({ user: req.user.id, ...blogData });

    const file = req.file && req.file.buffer;
    if (file && !blogData.bgImgUrl) {
      try {
        const photo = new Photo({
          photo: req.file.buffer,
        });

        await photo.save();

        newBlog.photo = photo.id;
      } catch (error) {
        return next(error);
      }
    }

    await newBlog.save();
    res.status(201).json({ blog: newBlog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { name, description } = req.body;

  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      res.status(404);
      throw new Error('Blog Not Found');
    }
    const user = await User.findById(req.user.id);
    if (!blog.user.equals(user.id)) {
      res.status(401);
      throw new Error('You are not authorized to access this resource');
    }

    const blogData = { name, description };
    const optionalFields = ['bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (field in req.body) {
        blogData[field] = req.body[field];
      }
    });

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      blogData,
      { new: true }
    );

    res.status(200).json({ blog: updatedBlog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate('user', [
      'name',
      'bio',
      'photo',
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
      'photo',
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
      'photo',
    ]);
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAuthUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).populate('user', [
      'name',
      'bio',
      'photo',
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
      ['name', 'bio', 'photo']
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
    const user = await User.findById(req.user.id);
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
