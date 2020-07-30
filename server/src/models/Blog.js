const _ = require('lodash');
const mongoose = require('mongoose');
const slugify = require('slugify');
const specifiedStringLength = require('../validations/specifiedStringLength');
const User = require('./User');

const requiredString = {
  type: String,
  required: [true, "can't be blank"],
};

const BlogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
    },
    name: {
      ...requiredString,
      ...specifiedStringLength('name', 2, 40),
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      ...specifiedStringLength('description', 2, 140),
    },
    bgImg: {
      image_url: String,
      large_image_url: String,
      img_attribution: String,
    },
    bookmarksCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

BlogSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

BlogSchema.methods.slugify = function () {
  this.slug = `${slugify(this.name)}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}`;
};

BlogSchema.methods.updateBookmarksCount = async function () {
  const blog = this;

  const count = await User.countDocuments({ bookmarks: { $in: [blog._id] } });
  blog.bookmarksCount = count;

  return await blog.save();
};

const blogParams = [
  '_id',
  'name',
  'slug',
  'description',
  'bgImg',
  'bookmarksCount',
  'user',
  'createdAt',
  'updatedAt',
];

BlogSchema.methods.toBlogJSON = function () {
  return _.pick(this, blogParams);
};

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
