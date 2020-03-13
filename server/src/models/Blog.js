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
    minLength: 4,
    maxLength: 40,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  description: {
    type: String,
    minLength: 7,
    maxLength: 80,
  },
}, { timestamps: true });

blogSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

blogSchema.methods.slugify = function () {
  this.slug = `${slugify(this.name)}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`;
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
