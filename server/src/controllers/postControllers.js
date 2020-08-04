const { User, Blog, Post, Comment } = require('../models');
const { ErrorHandler } = require('../utils/error');
const { dataUri } = require('../middleware');
const { uploader } = require('../services/cloudinary');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');

function getEnhancedPostFindQuery(condition, cursor, limit) {
  return Post.find(condition)
    .populate('user', ['name', 'bio', 'avatar'])
    .populate('blog', ['name', 'slug', 'description', 'bgImg'])
    .limit(limit)
    .skip(cursor)
    .sort({ createdAt: -1 });
}

exports.createPost = async (req, res) => {
  const { blogId } = req.params;
  const { title, body } = req.body;

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
      image = dataUri(req).content;
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
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, body } = req.body;

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
      image = dataUri(req).content;
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

  res.json({ post: updatedPost.toPostJSONFor(req.user) });

  // Remove old image from cloudinary
  if (
    post.bgImg &&
    post.bgImg.image_url &&
    updatedPost.bgImg &&
    updatedPost.bgImg.image_url &&
    post.bgImg.image_url !== updatedPost.bgImg.image_url
  ) {
    await deleteImageFromCloudinary(post.bgImg.image_url, 'bloggingplatform');
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorHandler(404, 'post not found');
  }

  if (!post.user.equals(req.user._id)) {
    throw new ErrorHandler(403, 'you are not allowed to delete that post');
  }

  await Promise.all([
    Post.deleteOne({ _id: postId }),
    Comment.deleteMany({ post: postId }),
  ]);

  res.json({ message: 'post deleted', post });

  // Delete image from cloudinary
  if (post.bgImg && post.bgImg.image_url) {
    await deleteImageFromCloudinary(post.bgImg.image_url, 'bloggingplatform');
  }
};

exports.deleteImage = async (req, res) => {
  if (!req.user._id.equals(req.post.user)) {
    throw new ErrorHandler(403, 'You are not authorized to remove post image');
  }

  req.post.bgImg = {};
  const post = await req.post.save();
  res.json({ message: 'Successfully removed image', post });

  if (req.post.bgImg && req.post.bgImg.image_url) {
    await deleteImageFromCloudinary(
      req.post.bgImg.image_url,
      'bloggingplatform'
    );
  }
};

exports.getAllPosts = async (req, res) => {
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = title
    ? { title: { $regex: new RegExp(title), $options: 'i' } }
    : {};

  const [posts, count] = await Promise.all([
    getEnhancedPostFindQuery(condition, cursor, limit).exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user || null)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getHomepagePosts = async (req, res) => {
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = {
    $or: [
      { user: req.user._id },
      { user: { $in: req.user.following } },
      { blog: { $in: req.user.bookmarks } },
    ],
  };

  if (title) {
    condition.title = { $regex: new RegExp(title), $options: 'i' };
  }

  const [posts, count] = await Promise.all([
    getEnhancedPostFindQuery(condition, cursor, limit).exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getAuthUserPosts = async (req, res) => {
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = {
    user: req.user._id,
    ...(title ? { title: { $regex: new RegExp(title), $options: 'i' } } : null),
  };

  const [posts, count] = await Promise.all([
    getEnhancedPostFindQuery(condition, cursor, limit).exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = {
    user: userId,
    ...(title ? { title: { $regex: new RegExp(title), $options: 'i' } } : null),
  };

  const user = await User.findById(userId).exec();
  if (!user) {
    throw new ErrorHandler(404, 'user not found');
  }

  const [posts, count] = await Promise.all([
    getEnhancedPostFindQuery(condition, cursor, limit).exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user || null)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getBlogPosts = async (req, res) => {
  const { blogId } = req.params;
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = {
    blog: blogId,
    ...(title ? { title: { $regex: new RegExp(title), $options: 'i' } } : null),
  };

  const blog = await Blog.findById(blogId).exec();
  if (!blog) {
    throw new ErrorHandler(404, 'blog not found');
  }

  const [posts, count] = await Promise.all([
    getEnhancedPostFindQuery(condition, cursor, limit).exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user || null)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getFavorites = async (req, res) => {
  const { userId } = req.params;
  const { title, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = title
    ? { title: { $regex: new RegExp(title), $options: 'i' } }
    : {};

  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  const postsQuery = getEnhancedPostFindQuery(condition, cursor, limit)
    .where('_id')
    .in(user.favorites);

  const [posts, count] = await Promise.all([
    postsQuery.exec(),
    Post.countDocuments(condition).exec(),
  ]);

  return res.json({
    posts: posts.map((post) => post.toPostJSONFor(req.user || null)),
    ...(cursor + posts.length < count
      ? { nextCursor: cursor + posts.length }
      : null),
  });
};

exports.getPostBySlug = async (req, res) => {
  const post = await Post.findById(req.post._id)
    .populate('user', ['name', 'bio', 'avatar'])
    .populate('blog', ['name', 'slug', 'description', 'bgImg']);

  return res.json({ post: post.toPostJSONFor(req.user || null) });
};

exports.favorite = async (req, res) => {
  const user = await req.user.favorite(req.post._id);
  const post = await req.post.updateFavoriteCount();

  return res.json({ post: post.toPostJSONFor(user) });
};

exports.unfavorite = async (req, res) => {
  const user = await req.user.unfavorite(req.post._id);
  const post = await req.post.updateFavoriteCount();

  return res.json({ post: post.toPostJSONFor(user) });
};
