const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true,
};

const postSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  blog: mongoose.ObjectId,
  title: {
    ...requiredString,
  },
  body: {
    ...requiredString,
  },
  comments: [{
    body: String,
    date: Date,
    default: Date.now,
  }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
