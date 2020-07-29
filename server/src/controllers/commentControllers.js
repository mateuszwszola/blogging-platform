const { Post, Comment } = require('../models');
const { ErrorHandler } = require('../utils/error');

exports.addComment = async (req, res) => {
  const { body } = req.body;
  const { postId } = req.params;

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

  return res.json({ comment });
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ErrorHandler(404, 'comment not found');
  }

  if (!req.user._id.equals(comment.user)) {
    throw new ErrorHandler(403, 'you are not authorized to delete a comment');
  }

  await Comment.deleteOne({ _id: comment._id });
  return res.json({ comment });
};

exports.getPostComments = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorHandler(404, 'Post Not Found');
  }
  const comments = await Comment.find({ post: postId }).populate('user', [
    'name',
    'bio',
    'avatar',
  ]);
  return res.json({ comments });
};
