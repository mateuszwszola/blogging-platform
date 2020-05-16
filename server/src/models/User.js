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
      photoURL: {
        type: String,
      },
      photoID: {
        type: mongoose.ObjectId,
        ref: 'Photo',
      },
    },
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
  const token = jwt.sign(payload, config.secrets.jwt, { expiresIn: 3600 });
  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
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
