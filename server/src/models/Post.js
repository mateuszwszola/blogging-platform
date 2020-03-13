const mongoose = require('mongoose');
const slugify = require('slugify');

const requiredString = {
  type: String,
  required: true,
};

const postSchema = new mongoose.Schema({
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
  },
  slug: {
    ...requiredString,
    unique: true,
    lowercase: true,
  },
  body: {
    ...requiredString,
  },
  comments: [{
    type: mongoose.ObjectId,
    ref: 'Comment',
  }],
}, { timestamps: true });

postSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

postSchema.methods.slugify = function () {
  this.slug = `${slugify(this.title)}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`;
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
