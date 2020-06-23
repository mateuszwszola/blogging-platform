const Post = require('../models/Post');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { ErrorHandler } = require('../utils/error');
const deleteS3Object = require('../utils/s3/deleteS3Object');

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

    const postData = { title, body, bgImg: {} };

    if (typeof req.body.bgImgUrl !== 'undefined') {
      postData.bgImg.url = req.body.bgImgUrl;
    }

    if (typeof req.body.imgAttribution !== 'undefined') {
      postData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    if (typeof req.body.tags !== 'undefined') {
      postData.tags = req.body.tags;
    }

    if (req.file) {
      postData.bgImg.url = req.file.location;
      postData.bgImg.s3Key = req.file.key;
    }

    const post = await Post.create({
      user: req.user._id,
      blog: blogId,
      ...postData,
    });

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
      throw new ErrorHandler(401, 'you are not allowed to update the post');
    }

    const postData = { title, body, bgImg: { ...post.bgImg } };

    if (typeof req.body.bgImgUrl !== 'undefined') {
      postData.bgImg.url = req.body.bgImgUrl;
    }

    if (typeof req.body.imgAttribution !== 'undefined') {
      postData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    if (typeof req.body.tags !== 'undefined') {
      postData.tags = req.body.tags;
    }

    if (req.file) {
      postData.bgImg.url = req.file.location;
      postData.bgImg.s3Key = req.file.key;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...postData },
      { new: true }
    );

    if (
      post.bgImg &&
      post.bgImg.s3Key &&
      (req.file || typeof req.body.bgImgUrl !== 'undefined')
    ) {
      await deleteS3Object(post.bgImg.s3Key);
    }

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
      throw new ErrorHandler(401, 'you are not allowed to delete that post');
    }

    const doc = await Post.findByIdAndDelete(postId);

    await Comment.deleteMany({
      _id: {
        $in: post.comments,
      },
    });

    if (post.bgImg && post.bgImg.s3Key) {
      await deleteS3Object(post.bgImg.s3Key);
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

exports.getFavorites = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }
    const posts = await Post.find()
      .where('_id')
      .in(user.favorites)
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg']);

    if (req.user) {
      res.json({ posts: posts.map((post) => post.toPostJSONFor(req.user)) });
    } else {
      res.json({ posts: posts.map((post) => post.toPostJSONFor(null)) });
    }
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
