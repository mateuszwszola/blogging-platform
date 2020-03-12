const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredString = {
  type: String,
  required: true,
};

const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  name: {
    ...requiredString,
    unique: true,
    minLength: 4,
    maxLength: 40,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  tags: {
    type: String,
  },
}, { timestamps: true });

blogSchema.pre('save', async (next) => {
  // check if name is unique
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
