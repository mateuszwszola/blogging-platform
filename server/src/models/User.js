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
      next(err);
    }
  }

  next();
});

// example of document/instance method
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

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
  };
};

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    _id: this._id,
    name: this.name,
    bio: this.bio,
    avatar: this.avatar,
    favorites: this.favorites,
    following: this.following,
    bookmarks: this.bookmarks,
    isFollowing: user ? user.isFollowing(this._id) : false,
    isOwner: user ? user._id.toString() === this._id.toString() : false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Favoriting
UserSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id);
  }

  return this.save();
};

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id);
  return this.save();
};

UserSchema.methods.isFavorite = function (id) {
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString();
  });
};

// Following
UserSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id);
  }

  return this.save();
};

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id);
  return this.save();
};

UserSchema.methods.isFollowing = function (id) {
  return this.following.some(function (followId) {
    return followId.toString() === id.toString();
  });
};

// Bookmarks
UserSchema.methods.bookmark = function (blogId) {
  if (this.bookmarks.indexOf(blogId) === -1) {
    this.bookmarks.push(blogId);
  }

  return this.save();
};

UserSchema.methods.unbookmark = function (blogId) {
  this.bookmarks.remove(blogId);
  return this.save();
};

UserSchema.methods.isBookmarking = function (blogId) {
  return this.bookmarks.some(function (id) {
    return id.toString() === blogId.toString();
  });
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
