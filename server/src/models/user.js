const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const requiredString = {
  type: String,
  required: true,
};

const userSchema = new mongoose.Schema({
  name: {
    ...requiredString,
    trim: true,
    minLength: 2,
    maxLength: 20,
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
    minLength: 7,
  },
},
{ timestamps: true });

userSchema.pre('save', async function (next) {
  const user = this;
  // Hash the password only if it's modified
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
userSchema.methods.generateAuthToken = async function () {
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
userSchema.statics.findByCredentials = async function (email, password) {
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

const User = mongoose.model('User', userSchema);

module.exports = User;
