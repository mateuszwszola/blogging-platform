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

  const count = await User.count({ favorites: { $in: [post._id] } });
  post.favoritesCount = count;

  return await post.save();
};

PostSchema.methods.addComment = function (commentId) {
  this.comments = this.comments.concat(commentId);
  this.save();
};

PostSchema.methods.toPostJSONFor = function (user) {
  return {
    _id: this._id,
    slug: this.slug,
    title: this.title,
    body: this.body,
    bgImgUrl: this.bgImgUrl,
    photo: this.photo,
    imgAttribution: this.imgAttribution,
    tags: this.tags,
    comments: this.comments,
    favoritesCount: this.favoritesCount,
    favorited: user ? user.isFavorite(this._id) : false,
    user: this.user,
    blog: this.blog,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
