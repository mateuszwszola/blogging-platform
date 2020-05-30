const Post = require('../models/Post');
const Blog = require('../models/Blog');
const Photo = require('../models/Photo');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { ErrorHandler } = require('../utils/error');
const createPhotoLink = require('../utils/createPhotoLink');

exports.createPost = async (req, res, next) => {
  const { title, body } = req.body;
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ErrorHandler(404, 'blog not found');
    }

    if (!blog.user.equals(req.user._id)) {
      throw new ErrorHandler(
        401,
        'you are not allowed to create post in this blog'
      );
    }

    const postData = { title, body };
    const optionalFields = ['tags', 'bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        postData[field] = req.body[field];
      }
    });

    const post = new Post({
      user: req.user._id,
      blog: blogId,
      ...postData,
    });

    const file = req.file && req.file.buffer;

    if (file) {
      const photo = await Photo.create({
        photo: req.file.buffer,
      });

      post.photo = photo.id;
      post.bgImgUrl = createPhotoLink(photo.id);
    }

    await post.save();

    res.json({ post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const { title, body } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'Post Not Found');
    }

    if (!post.user.equals(req.user._id)) {
      throw new ErrorHandler(
        401,
        'you are not allowed to create post in this blog'
      );
    }

    const postData = { title, body };
    const optionalFields = ['tags', 'bgImgUrl', 'imgAttribution'];
    optionalFields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        postData[field] = req.body[field];
      }
    });

    const file = req.file && req.file.buffer;

    if (file) {
      const photo = await Photo.create({
        photo: req.file.buffer,
      });

      postData.photo = photo.id;
      postData.bgImgUrl = createPhotoLink(photo.id);
    }

    if (post.photo && postData.bgImgUrl) {
      // delete old photo
      await Photo.findByIdAndDelete(post.photo);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...postData },
      { new: true }
    );

    res.json({ post: updatedPost });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'Post Not Found');
    }
    if (!post.user.equals(req.user._id)) {
      throw new ErrorHandler(
        401,
        'you are not allowed to create post in this blog'
      );
    }

    const doc = await Post.findByIdAndDelete(postId);

    await Comment.deleteMany({
      _id: {
        $in: post.comments,
      },
    });

    if (post.photo) {
      await Photo.deleteOne({ _id: post.photo });
    }
    res.json({ message: 'Post deleted', post: doc });
  } catch (err) {
    next(err);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getAllBlogPosts = async (req, res, next) => {
  const { blogId } = req.params;

  try {
    const posts = await Post.find({ blog: blogId })
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getAuthUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({
        createdAt: -1,
      });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({
        createdAt: -1,
      });

    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findById(req.post._id)
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg']);

    if (req.user) {
      res.json({ post: post.toPostJSONFor(req.user) });
    } else {
      res.json({ post: post.toPostJSONFor(null) });
    }
  } catch (err) {
    next(err);
  }
};

exports.favorite = async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.post._id;

  try {
    const user = await User.findById(userId);
    let post = await Post.findById(postId);

    await user.favorite(postId);

    post = await post.updateFavoriteCount();

    res.json({ post: post.toPostJSONFor(user) });
  } catch (err) {
    next(err);
  }
};

exports.unfavorite = async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.post._id;

  try {
    const user = await User.findById(userId);
    let post = await Post.findById(postId);

    await user.unfavorite(postId);

    post = await post.updateFavoriteCount();

    res.json({ post: post.toPostJSONFor(user) });
  } catch (err) {
    next(err);
  }
};
