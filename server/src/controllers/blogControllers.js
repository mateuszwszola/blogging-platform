const { Blog, Post } = require('../models');
const { ErrorHandler } = require('../utils/error');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const { uploader } = require('../services/cloudinary');
const { dataUri } = require('../middleware');

exports.createBlog = async (req, res) => {
  const { name } = req.body;

  const [blog, userBlogsCount] = await Promise.all([
    Blog.findOne({ name }).exec(),
    Blog.countDocuments({
      user: req.user._id,
    }).exec(),
  ]);

  if (blog) {
    throw new ErrorHandler(422, 'blog name already in use');
  }

  if (userBlogsCount >= 5) {
    throw new ErrorHandler(
      422,
      'the maximum number of blogs owned by a user is 5'
    );
  }

  const blogData = { user: req.user._id, name, bgImg: {} };

  if (typeof req.body.description !== 'undefined') {
    blogData.description = req.body.description;
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

    blogData.bgImg.image_url = result.eager[0].secure_url;
    blogData.bgImg.large_image_url = result.secure_url;
  }

  if (
    blogData.bgImg.image_url &&
    typeof req.body.imgAttribution !== 'undefined'
  ) {
    blogData.bgImg.img_attribution = req.body.imgAttribution;
  }

  const newBlog = await Blog.create({ ...blogData });

  return res.status(201).json({ blog: newBlog });
};

exports.updateBlog = async (req, res) => {
  if (!req.blog.user.equals(req.user._id)) {
    throw new ErrorHandler(403, 'You are not allowed to update the blog');
  }

  if (req.blog.name !== req.body.name) {
    const doc = await Blog.findOne({ name: req.body.name }).exec();
    if (doc) {
      throw new ErrorHandler(422, 'blog name aready in use');
    }
  }

  const blogData = { name: req.body.name, bgImg: { ...req.blog.bgImg } };

  if (typeof req.body.description !== 'undefined') {
    blogData.description = req.body.description;
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

    blogData.bgImg.image_url = result.eager[0].secure_url;
    blogData.bgImg.large_image_url = result.secure_url;
  }

  if (
    blogData.bgImg.image_url &&
    typeof req.body.imgAttribution !== 'undefined'
  ) {
    blogData.bgImg.img_attribution = req.body.imgAttribution;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.blog._id, blogData, {
    new: true,
  }).exec();

  res.status(200).json({ blog: updatedBlog });

  // Delete old image
  if (
    req.blog.bgImg &&
    req.blog.bgImg.image_url &&
    updatedBlog.bgImg &&
    updatedBlog.bgImg.image_url &&
    req.blog.bgImg.image_url !== updatedBlog.bgImg.image_url
  ) {
    await deleteImageFromCloudinary(
      req.blog.bgImg.image_url,
      'bloggingplatform'
    );
  }
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.blogId)
    .populate('user', ['name', 'bio', 'avatar'])
    .exec();

  return res.json({ blog });
};

exports.getBlogBySlugName = async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate('user', ['name', 'bio', 'avatar'])
    .exec();

  if (!blog) {
    throw new ErrorHandler(404, 'Blog Not Found');
  }

  return res.json({ blog });
};

exports.getAllBlogs = async (req, res) => {
  const { name, cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  // Make sure cursor and limit values are numbers
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  const blogsQuery = Blog.find(condition)
    .populate('user', ['name', 'bio', 'avatar'])
    .skip(cursor)
    .limit(limit)
    .sort({ createdAt: -1 });

  const countQuery = Blog.countDocuments();

  const [blogs, count] = await Promise.all([
    blogsQuery.exec(),
    countQuery.exec(),
  ]);

  return res.json({
    blogs,
    ...(cursor + blogs.length < count
      ? { nextCursor: cursor + blogs.length }
      : null),
  });
};

exports.getAuthUserBlogs = async (req, res) => {
  const { name } = req.query;
  const condition = {
    user: req.user._id,
    ...(name ? { name: { $regex: new RegExp(name), $options: 'i' } } : null),
  };

  const blogs = await Blog.find(condition)
    .limit(10)
    .populate('user', ['name', 'bio', 'avatar'])
    .exec();

  return res.json({ blogs });
};

exports.getUserBlogs = async (req, res) => {
  const { name } = req.query;
  const condition = {
    user: req.params.userId,
    ...(name ? { name: { $regex: new RegExp(name), $options: 'i' } } : null),
  };

  const blogs = await Blog.find(condition)
    .limit(10)
    .populate('user', ['name', 'bio', 'avatar'])
    .exec();

  return res.json({ blogs });
};

exports.deleteBlog = async (req, res) => {
  const { blog } = req;

  if (!blog.user.equals(req.user._id)) {
    throw new ErrorHandler(403, 'You are not authorized to delete a blog');
  }

  const [posts] = await Promise.all([
    // Store posts images, before delete them
    Post.find({ blog: blog._id }).select('bgImg').exec(),
    Blog.deleteOne({ _id: blog._id }).exec(),
  ]);

  await Post.deleteMany({ blog: blog._id });

  res.status(200).json({ message: 'Blog deleted', blog });

  await Promise.all([
    ...posts.map(async (post) => {
      if (post.bgImg && post.bgImg.image_url) {
        await deleteImageFromCloudinary(
          post.bgImg.image_url,
          'bloggingplatform'
        );
      }
    }),
    blog.bgImg && blog.bgImg.image_url
      ? deleteImageFromCloudinary(blog.bgImg.image_url, 'bloggingplatform')
      : null,
  ]);
};

exports.deleteImage = async (req, res) => {
  const { user, blog } = req;

  if (!user._id.equals(blog.user)) {
    throw new ErrorHandler(403, 'You are not authorized to remove blog image');
  }

  blog.bgImg = {};
  await blog.save();

  res.json({ message: 'Successfully removed image' });

  if (blog.bgImg && blog.bgImg.image_url) {
    await deleteImageFromCloudinary(blog.bgImg.image_url, 'bloggingplatform');
  }
};

exports.getBookmarks = async (req, res) => {
  const blogs = await Blog.find({
    _id: { $in: req.user.bookmarks },
  })
    .populate('user', ['name', 'bio', 'avatar'])
    .exec();

  return res.json({ blogs });
};

exports.bookmark = async (req, res) => {
  if (req.user._id.equals(req.blog._id)) {
    throw new ErrorHandler(403, 'you cannot bookmark your own blog');
  }

  await req.user.bookmark(blog._id);
  const blog = await req.blog.updateBookmarksCount();

  return res.json({ blog });
};

exports.unbookmark = async (req, res) => {
  await req.user.unbookmark(req.blog._id);

  const blog = await req.blog.updateBookmarksCount();

  return res.json({ blog });
};
