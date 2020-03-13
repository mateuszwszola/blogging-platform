const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const Blog = require('../models/Blog');
const errorFormatter = require('../validations/errorFormatter');

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { title, body } = req.body;
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error('blog does not exists');
    }
    if (!blog.user.equals(req.user.id)) {
      res.status(401);
      throw new Error('you are not allowed to create post in this blog');
    }

    const post = new Post({
      user: req.user.id, blog: blogId, title, body,
    });
    await post.save();

    res.json({ post });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
