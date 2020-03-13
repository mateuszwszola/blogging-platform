const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredString = {
  type: String,
  required: true,
};

const blogSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  name: {
    ...requiredString,
    unique: true,
    minLength: 4,
    maxLength: 40,
    lowercase: true,
  },
  description: {
    type: String,
    minLength: 7,
    maxLength: 80,
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

blogSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name);
  }

  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
