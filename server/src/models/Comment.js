const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true,
};

const commentSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
