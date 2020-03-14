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

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
  },
  blog: {
    type: mongoose.ObjectId,
    ref: 'Blog',
  },
  title: {
    ...requiredString,
    maxlength: 60,
  },
  slug: {
    ...requiredString,
    unique: true,
    lowercase: true,
  },
  body: {
    ...requiredString,
    ...specifiedStringLength('body', 1, 255),
  },
  comments: [{
    type: mongoose.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true });

PostSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

PostSchema.methods.slugify = function () {
  this.slug = `${slugify(this.title)}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`;
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
