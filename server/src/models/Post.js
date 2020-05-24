const mongoose = require('mongoose');
const slugify = require('slugify');
const Photo = require('./Photo');

const specifiedStringLength = require('../validations/specifiedStringLength');

const requiredString = {
  type: String,
  required: [true, "can't be blank"],
};

const PostSchema = new mongoose.Schema(
  {
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
      ...specifiedStringLength('title', 2, 60),
    },
    slug: {
      ...requiredString,
      unique: true,
      lowercase: true,
    },
    body: {
      ...requiredString,
    },
    bgImgUrl: {
      type: String,
    },
    photo: {
      type: mongoose.ObjectId,
      ref: 'Photo',
    },
    imgAttribution: {
      type: String,
    },
    comments: [
      {
        type: mongoose.ObjectId,
        ref: 'Comment',
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

PostSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

PostSchema.methods.slugify = function () {
  this.slug = `${slugify(this.title)}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}`;
};

PostSchema.methods.addComment = function (commentId) {
  this.comments = this.comments.concat(commentId);
  this.save();
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
