const Blog = require('../models/Blog');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');
const { uploader } = require('../config/services/cloudinary');
const { dataUri } = require('../middleware/multer');

exports.createBlog = async (req, res, next) => {
  const { name } = req.body;

  try {
    const blog = await Blog.findOne({ name });
    if (blog) {
      throw new ErrorHandler(422, 'blog name already in use');
    }

    const blogData = { user: req.user._id, name, bgImg: {} };

    if (typeof req.body.description !== 'undefined') {
      blogData.description = req.body.description;
    }

    if (req.file) {
      const file = dataUri(req).content;
      const result = await uploader.upload(file, {
        upload_preset: 'bloggingplatform',
      });
      blogData.bgImg.image_url = result.secure_url;
      blogData.bgImg.large_image_url = result.eager[0].secure_url;
    } else if (req.body.bgImgUrl) {
      const result = await uploader.upload(req.body.bgImgUrl, {
        upload_preset: 'bloggingplatform',
      });
      blogData.bgImg.image_url = result.secure_url;
      blogData.bgImg.large_image_url = result.eager[0].secure_url;
    }

    if (
      blogData.bgImg.image_url &&
      typeof req.body.imgAttribution !== 'undefined'
    ) {
      blogData.bgImg.img_attribution = req.body.imgAttribution;
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

    if (req.file) {
      const file = dataUri(req).content;
      const result = await uploader.upload(file, {
        upload_preset: 'bloggingplatform',
      });
      blogData.bgImg.image_url = result.secure_url;
      blogData.bgImg.large_image_url = result.eager[0].secure_url;
    } else if (req.body.bgImgUrl) {
      const result = await uploader.upload(req.body.bgImgUrl, {
        upload_preset: 'bloggingplatform',
      });
      blogData.bgImg.image_url = result.secure_url;
      blogData.bgImg.large_image_url = result.eager[0].secure_url;
    }

    if (
      blogData.bgImg.image_url &&
      typeof req.body.imgAttribution !== 'undefined'
    ) {
      blogData.bgImg.img_attribution = req.body.imgAttribution;
    }

    // TODO: Delete old image

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });

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

    // TODO: Delete blog image

    const posts = await Post.find({ blog: blog._id }).exec();
    posts.forEach(async (post) => {
      // TODO: Delete post image
      await Post.deleteOne({ _id: post._id });
    });

    res.status(200).json({ message: 'Blog deleted', blog });
  } catch (err) {
    next(err);
  }
};
