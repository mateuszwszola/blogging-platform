const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true,
};

const blogSchema = new mongoose.Schema({
  user: mongoose.ObjectId,
  name: {
    ...requiredString,
  },
  tags: {
    type: String,
  },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
