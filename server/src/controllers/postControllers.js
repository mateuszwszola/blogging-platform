const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const Blog = require('../models/Blog');
const Photo = require('../models/Photo');
const errorFormatter = require('../validations/errorFormatter');

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { title, body } = req.body;
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404);
      throw new Error('blog does not exists');
    }
    if (!blog.user.equals(req.user._id)) {
      res.status(401);
      throw new Error('you are not allowed to create post in this blog');
    }

    const postData = { title, body };
    const optionalFields = ['tags', 'bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (field in req.body) {
        postData[field] = req.body[field];
      }
    });

    const post = new Post({
      user: req.user._id,
      blog: blogId,
      ...postData,
    });

    const file = req.file && req.file.buffer;
    if (file && !postData.bgImgUrl) {
      try {
        const photo = new Photo({
          photo: req.file.buffer,
        });

        await photo.save();

        post.photo = photo.id;
      } catch (error) {
        return next(error);
      }
    }

    await post.save();

    res.json({ post });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const { title, body } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post Not Found');
    }
    if (!post.user.equals(req.user._id)) {
      res.status(401);
      throw new Error('you are not allowed to create post in this blog');
    }

    const postData = { title, body };
    const optionalFields = ['tags', 'bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (field in req.body) {
        postData[field] = req.body[field];
      }
    });

    const file = req.file && req.file.buffer;
    if (file && !postData.bgImgUrl) {
      try {
        const photo = new Photo({
          photo: req.file.buffer,
        });

        await photo.save();

        postData.photo = photo.id;
      } catch (error) {
        return next(error);
      }
    }

    // if (postData.bgImgUrl && post.photo) {
    //   try {
    //     await Photo.findByIdAndDelete(post.photo._id);
    //   } catch (error) {
    //     next(error);
    //   }
    // }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, body, ...postData },
      { new: true }
    );

    res.json({ post: updatedPost });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post Not Found');
    }
    if (!post.user.equals(req.user._id)) {
      res.status(401);
      throw new Error('you are not allowed to create post in this blog');
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('user', ['name', 'bio', 'photo'])
      .populate('blog', ['name', 'slug', 'description', 'photo', 'bgImgUrl'])
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getAllBlogPosts = async (req, res, next) => {
  const { blogId } = req.params;

  try {
    const posts = await Post.find({ blog: blogId })
      .populate('user', ['name', 'bio', 'photo'])
      .populate('blog', ['name', 'slug', 'description', 'photo', 'bgImgUrl'])
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOne({ slug })
      .populate('user', ['name', 'bio', 'photo'])
      .populate('blog', ['name', 'slug', 'description', 'photo', 'bgImgUrl']);
    if (!post) {
      res.status(404);
      throw new Error('Post Not Found');
    }

    res.json({ post });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', ['name', 'bio', 'photo'])
      .populate('blog', ['name', 'slug', 'description', 'photo', 'bgImgUrl'])
      .sort({
        createdAt: -1,
      });
    res.json({ posts });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
