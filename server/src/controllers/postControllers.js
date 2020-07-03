const Post = require('../models/Post');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { ErrorHandler } = require('../utils/error');
const { dataUri } = require('../middleware');
const { uploader } = require('../services/cloudinary');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');

exports.createPost = async (req, res, next) => {
  const { blogId } = req.params;
  const { title, body } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ErrorHandler(404, 'blog not found');
    }

    if (!blog.user.equals(req.user._id)) {
      throw new ErrorHandler(
        403,
        'you are not allowed to create post in this blog'
      );
    }

    const postData = {
      user: req.user._id,
      blog: blogId,
      title,
      body,
      bgImg: {},
    };

    if (typeof req.body.tags !== 'undefined') {
      postData.tags = req.body.tags;
    }

    if (req.file || req.body.bgImgUrl) {
      let image;
      if (req.file) {
        const file = dataUri(req).content;
        image = file;
      } else {
        image = req.body.bgImgUrl;
      }

      const result = await uploader.upload(image, {
        upload_preset: 'bloggingplatform',
      });

      postData.bgImg.image_url = result.eager[0].secure_url;
      postData.bgImg.large_image_url = result.secure_url;
    }

    if (
      postData.bgImg.image_url &&
      typeof req.body.imgAttribution !== 'undefined'
    ) {
      postData.bgImg.img_attribution = req.body.imgAttribution;
    }

    const post = await Post.create({
      ...postData,
    });

    return res.status(201).json({ post: post.toPostJSONFor(req.user) });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const { title, body } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'post not found');
    }

    if (!post.user.equals(req.user._id)) {
      throw new ErrorHandler(403, 'you are not allowed to update the post');
    }

    const newPostData = { title, body, bgImg: { ...post.bgImg } };

    if (typeof req.body.tags !== 'undefined') {
      newPostData.tags = req.body.tags;
    }

    if (req.file || req.body.bgImgUrl) {
      let image;
      if (req.file) {
        const file = dataUri(req).content;
        image = file;
      } else {
        image = req.body.bgImgUrl;
      }

      const result = await uploader.upload(image, {
        upload_preset: 'bloggingplatform',
      });

      newPostData.bgImg.image_url = result.eager[0].secure_url;
      newPostData.bgImg.large_image_url = result.secure_url;
    }

    if (
      newPostData.bgImg.image_url &&
      typeof req.body.imgAttribution !== 'undefined'
    ) {
      newPostData.bgImg.img_attribution = req.body.imgAttribution;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...newPostData },
      { new: true }
    );

    // TODO: remove old image
    if (
      post.bgImg &&
      post.bgImg.image_url &&
      updatedPost.bgImg &&
      updatedPost.bgImg.image_url &&
      post.bgImg.image_url !== updatedPost.bgImg.image_url
    ) {
      await deleteImageFromCloudinary(post.bgImg.image_url, 'bloggingplatform');
    }

    return res.json({ post: updatedPost.toPostJSONFor(req.user) });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new ErrorHandler(404, 'post not found');
    }

    if (!post.user.equals(req.user._id)) {
      throw new ErrorHandler(403, 'you are not allowed to delete that post');
    }

    const doc = await Post.findByIdAndDelete(postId);

    await Comment.deleteMany({
      _id: {
        $in: post.comments,
      },
    });

    // TODO: remove image
    if (post.bgImg && post.bgImg.image_url) {
      await deleteImageFromCloudinary(post.bgImg.image_url, 'bloggingplatform');
    }

    return res.json({ message: 'post deleted', post: doc });
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

    if (req.user) {
      return res.json({
        posts: posts.map((post) => post.toPostJSONFor(req.user)),
      });
    } else {
      return res.json({ posts: posts.map((post) => post.toPostJSONFor(null)) });
    }
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

    return res.json({
      posts: posts.map((post) => post.toPostJSONFor(req.user)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'user not found');
    }

    const posts = await Post.find({ user: userId })
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({
        createdAt: -1,
      });

    if (req.user) {
      return res.json({
        posts: posts.map((post) => post.toPostJSONFor(req.user)),
      });
    } else {
      return res.json({ posts: posts.map((post) => post.toPostJSONFor(null)) });
    }
  } catch (err) {
    next(err);
  }
};

exports.getBlogPosts = async (req, res, next) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new ErrorHandler(404, 'blog not found');
    }

    const posts = await Post.find({ blog: blogId })
      .populate('user', ['name', 'bio', 'avatar'])
      .populate('blog', ['name', 'slug', 'description', 'bgImg'])
      .sort({ createdAt: -1 });

    if (req.user) {
      return res.json({
        posts: posts.map((post) => post.toPostJSONFor(req.user)),
      });
    } else {
      return res.json({ posts: posts.map((post) => post.toPostJSONFor(null)) });
    }
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
      return res.json({
        posts: posts.map((post) => post.toPostJSONFor(req.user)),
      });
    } else {
      return res.json({ posts: posts.map((post) => post.toPostJSONFor(null)) });
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
  let user = req.user;
  let post = req.post;

  try {
    user = await user.favorite(post._id);
    post = await post.updateFavoriteCount();

    return res.json({ post: post.toPostJSONFor(user) });
  } catch (err) {
    next(err);
  }
};

exports.unfavorite = async (req, res, next) => {
  let user = req.user;
  let post = req.post;

  try {
    user = await user.unfavorite(post._id);
    post = await post.updateFavoriteCount();

    return res.json({ post: post.toPostJSONFor(user) });
  } catch (err) {
    next(err);
  }
};
