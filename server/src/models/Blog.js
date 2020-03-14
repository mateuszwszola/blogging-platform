const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredString = {
  type: String,
  required: [true, "can't be blank"],
};

const specifiedStringLength = (field, minlength, maxlength) => {
  const obj = {};
  if (minlength) {
    obj.minlength = [minlength, `${field} must have min ${minlength} characters`];
  }
  if (maxlength) {
    obj.maxlength = [maxlength, `${field} must have max ${maxlength} characters`];
  }
  return obj;
};

const BlogSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  name: {
    ...requiredString,
    ...specifiedStringLength('name', 4, 40),
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  description: {
    type: String,
    ...specifiedStringLength('description', 7, 60),
  },
}, { timestamps: true });

BlogSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

BlogSchema.methods.slugify = function () {
  this.slug = `${slugify(this.name)}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`;
};

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
