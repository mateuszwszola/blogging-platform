const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true,
};

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.ObjectId,
      ref: 'Post',
    },
    body: {
      ...requiredString,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
