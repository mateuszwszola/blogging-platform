const _ = require('lodash');
const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');
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
    bgImg: {
      image_url: String,
      large_image_url: String,
      img_attribution: String,
    },
    comments: [
      {
        type: mongoose.ObjectId,
        ref: 'Comment',
      },
    ],
    tags: [String],
    favoritesCount: {
      type: Number,
      default: 0,
    },
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

PostSchema.methods.updateFavoriteCount = async function () {
  const post = this;

  const count = await User.countDocuments({ favorites: { $in: [post._id] } });
  post.favoritesCount = count;

  return post.save();
};

PostSchema.methods.addComment = function (commentId) {
  if (!this.comments.includes(commentId)) {
    this.comments.push(commentId);
  }

  return this.save();
};

const postParams = [
  '_id',
  'slug',
  'title',
  'body',
  'bgImg',
  'tags',
  'comments',
  'favoritesCount',
  'user',
  'blog',
  'createdAt',
  'updatedAt',
];

PostSchema.methods.toPostJSONFor = function (user) {
  return {
    ..._.pick(this, postParams),
    favorited: user ? user.isFavorite(this._id) : false,
  };
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
