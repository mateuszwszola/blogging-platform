const _ = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { ErrorHandler } = require('../utils/error');

const specifiedStringLength = require('../validations/specifiedStringLength');

const requiredString = {
  type: String,
  required: [true, "can't be blank"],
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      ...requiredString,
      ...specifiedStringLength('name', 2, 40),
      trim: true,
    },
    email: {
      ...requiredString,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler(400, 'Invalid Email Address');
        }
      },
    },
    password: {
      ...requiredString,
      minlength: 7,
    },
    bio: {
      type: String,
      maxlength: 100,
    },
    avatar: {
      image_url: String,
    },
    favorites: [{ type: mongoose.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.ObjectId, ref: 'Blog' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    } catch (err) {
      return next(err);
    }
  }

  next();
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, config.secrets.jwt, {
    expiresIn: 3600,
  });
  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const authParams = ['_id', 'name', 'email', 'bio', 'avatar'];

UserSchema.methods.toAuthJSON = function () {
  return _.pick(this, authParams);
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    ..._.pick(this, [
      ...authParams,
      'favorites',
      'following',
      'bookmarks',
      'createdAt',
      'updatedAt',
    ]),
    isFollowing: user ? user.isFollowing(this._id) : false,
    isOwner: user ? user._id.toString() === this._id.toString() : false,
  };
};

// Favoriting
UserSchema.methods.favorite = function (id) {
  if (!this.favorites.includes(id)) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function (id) {
  return this.favorites.some(
    (favoriteId) => favoriteId.toString() === id.toString()
  );
};

// Following
UserSchema.methods.follow = function (id) {
  if (!this.following.includes(id)) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id) {
  return this.following.some(
    (followId) => followId.toString() === id.toString()
  );
};

// Bookmarks
UserSchema.methods.bookmark = function (blogId) {
  if (!this.bookmarks.includes(blogId)) {
    this.bookmarks.push(blogId);
  }

  return this.save();
};

UserSchema.methods.unbookmark = function (blogId) {
  this.bookmarks.remove(blogId);
  return this.save();
};

UserSchema.methods.isBookmarking = function (blogId) {
  return this.bookmarks.some((id) => id.toString() === blogId.toString());
};

// model method
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new ErrorHandler(422, 'Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ErrorHandler(422, 'Invalid login credentials');
  }

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
