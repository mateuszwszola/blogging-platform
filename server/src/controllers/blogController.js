const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const errorFormatter = require('../validations/errorFormatter');

exports.createBlog = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { name, tags, description } = req.body;

  try {
    const blog = await Blog.findOne({ name });
    if (blog) {
      res.status(400);
      throw new Error(`blog '${name}' already exists`);
    }
    const newBlog = new Blog({ name, tags, description });
    newBlog.user = req.user.id;
    await newBlog.save();
    res.status(201).json({ blog: newBlog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
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
    const blog = await Blog.findOne({ slug });
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
    const blogs = await Blog.find({});
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAuthUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    res.json({ blogs });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId });
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

exports.updateBlog = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { name, tags, description } = req.body;

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

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, { name, tags, description });

    res.status(200).json({ blog: updatedBlog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
