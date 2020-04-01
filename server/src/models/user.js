const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const requiredString = {
  type: String,
  required: [true, "can't be blank"],
};

const specifiedStringLength = (field, minlength, maxlength) => {
  const obj = {};
  if (minlength) {
    obj.minlength = [
      minlength,
      `${field} must have min ${minlength} characters`,
    ];
  }
  if (maxlength) {
    obj.maxlength = [
      maxlength,
      `${field} must have max ${maxlength} characters`,
    ];
  }
  return obj;
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      ...requiredString,
      ...specifiedStringLength('name', 2, 20),
      trim: true,
    },
    email: {
      ...requiredString,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email Address');
        }
      },
    },
    password: {
      ...requiredString,
      ...specifiedStringLength('password', 7),
    },
    bio: {
      type: String,
      ...specifiedStringLength('bio', 2, 60),
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
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 3600 });
  return token;
};

// model method
UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials');
  }

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
