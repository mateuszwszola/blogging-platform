const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const errorFormatter = require('../validations/errorFormatter');

exports.addComment = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { body } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post Not Found');
    }
    const newComment = new Comment({ body, user: req.user.id, post: postId });
    await newComment.save();
    post.addComment(newComment.id);
    res.json({ comment: newComment });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
