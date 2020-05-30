const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');

exports.addComment = async (req, res, next) => {
  const { body } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'Post not found');
    }

    const comment = await Comment.create({
      body,
      user: req.user._id,
      post: postId,
    });

    await post.addComment(comment._id);

    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findOne({
      _id: commentId,
      user: req.user._id,
    });
    if (!comment) {
      throw new ErrorHandler(
        401,
        'You are not authorized to delete this comment'
      );
    }
    await Comment.findByIdAndDelete(comment._id);
    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.getPostComments = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'Post Not Found');
    }
    const comments = await Comment.find({ post: postId }).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};
