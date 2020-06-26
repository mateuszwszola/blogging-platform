const Blog = require('../models/Blog');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');
const deleteS3Object = require('../utils/s3/deleteS3Object');

exports.createBlog = async (req, res, next) => {
  const { name } = req.body;

  try {
    const blog = await Blog.findOne({ name });
    if (blog) {
      throw new ErrorHandler(400, `blog '${name}' already exists`);
    }

    const blogData = { user: req.user._id, name, bgImg: {} };

    if (typeof req.body.description !== 'undefined') {
      blogData.description = req.body.description;
    }

    if (typeof req.body.bgImgUrl !== 'undefined') {
      blogData.bgImg.url = req.body.bgImgUrl;
    }

    if (req.file) {
      blogData.bgImg.url = req.file.location;
      blogData.bgImg.s3Key = req.file.key;
    }

    if (blogData.bgImg.url && typeof req.body.imgAttribution !== 'undefined') {
      blogData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    const newBlog = await Blog.create({ ...blogData });

    res.status(201).json({ blog: newBlog });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findOne({
      _id: blogId,
      user: req.user._id,
    });

    if (!blog) {
      throw new ErrorHandler(404, 'Blog Not Found');
    }

    const blogData = { name: req.body.name, bgImg: { ...blog.bgImg } };

    if (typeof req.body.description !== 'undefined') {
      blogData.description = req.body.description;
    }

    if (typeof req.body.bgImgUrl !== 'undefined') {
      blogData.bgImg.url = req.body.bgImgUrl;
    }

    if (typeof req.body.imgAttribution !== 'undefined') {
      blogData.bgImg.imgAttribution = req.body.imgAttribution;
    }

    if (req.file) {
      blogData.bgImg.url = req.file.location;
      blogData.bgImg.s3Key = req.file.key;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });

    if (
      blog.bgImg &&
      blog.bgImg.s3Key &&
      (req.file || typeof req.body.bgImgUrl !== 'undefined')
    ) {
      await deleteS3Object(blog.bgImg.s3Key);
    }

    res.status(200).json({ blog: updatedBlog });
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

    if (!blog) {
      throw new ErrorHandler(404, 'Blog Not Found');
    }

    res.json({ blog });
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
    res.json({ blog });
  } catch (err) {
    next(err);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.getAuthUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).populate('user', [
      'name',
      'bio',
      'avatar',
    ]);
    res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId }).populate(
      'user',
      ['name', 'bio', 'avatar']
    );
    res.json({ blogs });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.blogId,
      user: req.user._id,
    });

    if (!blog) {
      throw new ErrorHandler(404, 'Blog not found');
    }

    await Blog.deleteOne({ _id: req.params.blogId });

    if (blog.bgImg && blog.bgImg.s3Key) {
      await deleteS3Object(blog.bgImg.s3Key);
    }

    const posts = await Post.find({ blog: blog._id }).exec();
    posts.forEach(async (post) => {
      if (post.photo.s3Key) {
        await deleteS3Object(post.photo.s3Key);
      }
      await Post.deleteOne({ _id: post._id });
    });
    res.status(201).json({ message: 'Blog deleted', blog });
  } catch (err) {
    next(err);
  }
};
