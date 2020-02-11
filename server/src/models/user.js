const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('express-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: (value) => validator.check(value).isEmail(),
  },
  password: String,
  image: String,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = (candidatePassword, next) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return next(err);
    }
    next(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
