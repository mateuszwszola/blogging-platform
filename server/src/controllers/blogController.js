const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const errorFormatter = require('../validations/errorFormatter');

exports.createBlog = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { user, name, tags } = req.body;

  try {
    const blog = new Blog({ user, name, tags });
    await blog.save();
    res.status(201).json({ blog });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getBlogBySlugName = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const blog = Blog.findOne({ slug });
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

exports.getBlogs = async (req, res, next) => {

};

exports.deleteBlog = async (req, res, next) => {

};

exports.updateBlog = async (req, res, next) => {

};
