const Blog = require('../models/Blog');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');
const { deleteImageFromCloudinary } = require('../utils/cloudinary');
const { uploader } = require('../services/cloudinary');
const { dataUri } = require('../middleware');

exports.createBlog = async (req, res, next) => {
  const { name } = req.body;

  try {
    const blog = await Blog.findOne({ name }).exec();
    if (blog) {
      throw new ErrorHandler(422, 'blog name already in use');
    }

    const userBlogsCount = await Blog.countDocuments({
      user: req.user._id,
    }).exec();

    if (userBlogsCount >= 5) {
      return res
        .status(422)
        .json({ message: 'The maximum number of blogs owned by a user is 5' });
    }

    const blogData = { user: req.user._id, name, bgImg: {} };

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

    const newBlog = await Blog.create({ ...blogData });

    return res.status(201).json({ blog: newBlog });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    if (!req.blog.user.equals(req.user._id)) {
      throw new ErrorHandler(403, 'You are not allowed to update the blog');
    }

    if (req.blog.name.toLowerCase() !== req.body.name.toLowerCase()) {
      const doc = await Blog.findOne({ name: req.body.name });
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
    });

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

    return res.status(200).json({ blog: updatedBlog });
  } catch (err) {
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.blogId).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);

    return res.json({ blog });
  } catch (err) {
    next(err);
  }
};

exports.getBlogBySlugName = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug }).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    if (!blog) {
      throw new ErrorHandler(404, 'Blog Not Found');
    }

    return res.json({ blog });
  } catch (err) {
    next(err);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  const { name } = req.query;
  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  const blogsLimit = 10;

  let cursor = req.query.cursor ? Number(req.query.cursor) : 0;

  try {
    const blogs = await Blog.find(condition)
      .populate('user', ['name', 'bio', 'avatar'])
      .skip(cursor)
      .limit(blogsLimit)
      .sort({ createdAt: -1 })
      .exec();

    const body = { blogs };
    if (blogs.length === blogsLimit) {
      body.nextCursor = cursor + blogsLimit;
    }

    return res.json(body);
  } catch (err) {
    next(err);
  }
};

exports.getAuthUserBlogs = async (req, res, next) => {
  const { name } = req.query;
  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  condition.user = req.user._id;

  try {
    const blogs = await Blog.find(condition).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);

    return res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  const { name } = req.query;
  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  condition.user = req.params.userId;

  try {
    const blogs = await Blog.find(condition).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);

    return res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  const { blog } = req;

  try {
    if (!blog.user.equals(req.user._id)) {
      throw new ErrorHandler(403, 'You are not authorized to delete a blog');
    }

    await Blog.deleteOne({ _id: blog._id });

    if (blog.bgImg && blog.bgImg.image_url) {
      await deleteImageFromCloudinary(blog.bgImg.image_url, 'bloggingplatform');
    }

    const posts = await Post.find({ blog: blog._id }).exec();
    // TODO: Na pewno tutaj też nie chcesz czekać aż się skończy delete?
    posts.forEach(async (post) => {
      await Post.deleteOne({ _id: post._id });
      if (post.bgImg && post.bgImg.image_url) {
        await deleteImageFromCloudinary(
          post.bgImg.image_url,
          'bloggingplatform'
        );
      }
    });

    return res.status(200).json({ message: 'Blog deleted', blog });
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    if (!req.user._id.equals(req.blog.user)) {
      throw new ErrorHandler(
        403,
        'You are not authorized to remove blog image'
      );
    }

    if (req.blog.bgImg && req.blog.bgImg.image_url) {
      await deleteImageFromCloudinary(
        req.blog.bgImg.image_url,
        'bloggingplatform'
      );
      req.blog.bgImg = {};
      await req.blog.save();
      return res.json({ message: 'Successfully removed image' });
    } else {
      return res.status(400).json({ message: 'Unable to remove image' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const blogs = await Blog.find({
      _id: { $in: req.user.bookmarks },
    }).populate('user', ['name', 'bio', 'avatar']);

    return res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.bookmark = async (req, res, next) => {
  let { user, blog } = req;

  try {
    if (user._id.equals(blog._id)) {
      throw new ErrorHandler(403, 'you cannot bookmark your own blog');
    }
    await user.bookmark(blog._id);
    blog = await blog.updateBookmarksCount();

    return res.json({ blog });
  } catch (err) {
    next(err);
  }
};

exports.unbookmark = async (req, res, next) => {
  let { user, blog } = req;

  try {
    await user.unbookmark(blog._id);
    blog = await blog.updateBookmarksCount();

    return res.json({ blog });
  } catch (err) {
    next(err);
  }
};
