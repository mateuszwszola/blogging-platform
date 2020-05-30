const router = require('express').Router();
const { auth } = require('../middleware/auth');
const blogControllers = require('../controllers/blogControllers');
const blogValidation = require('../validations/blog');
const photoUpload = require('../middleware/photoUpload');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { validate } = require('../middleware/validate');

/*
  @route   POST api/blogs
  @desc    Create a blog
  @access  Private
 */
router.post(
  '/',
  auth.required,
  photoUpload.single('photo'),
  validate(blogValidation.validateBlog),
  blogControllers.createBlog
);

/*
  @route   PUT api/blogs/:blogId
  @desc    Update blog
  @access  Private
 */
router.put(
  '/:blogId',
  auth.required,
  validateParamObjectId('blogId'),
  photoUpload.single('photo'),
  validate(blogValidation.validateBlog),
  blogControllers.updateBlog
);

/*
  @route   GET api/blogs
  @desc    Get auth user blogs
  @access  Private
 */
router.get('/', auth.required, blogControllers.getAuthUserBlogs);

/*
  @route   GET api/blogs/all
  @desc    Get all blogs
  @access  Public
 */
router.get('/all', blogControllers.getAllBlogs);

/*
  @route   GET api/blogs/:blogId
  @desc    Get blog by ID
  @access  Public
 */
router.get(
  '/:blogId',
  validateParamObjectId('blogId'),
  blogControllers.getBlogById
);

/*
  @route   GET api/blogs/slug/:slugName
  @desc    Get a blog by slug name
  @access  Public
 */
router.get('/slug/:slug', blogControllers.getBlogBySlugName);

/*
  @route   GET api/blogs/user/:userId
  @desc    Get user blogs
  @access  Public
 */
router.get(
  '/user/:userId',
  validateParamObjectId('userId'),
  blogControllers.getUserBlogs
);

/*
  @route   DELETE api/blogs/:blogId
  @desc    Delete blog
  @access  Private
 */
router.delete(
  '/:blogId',
  auth.required,
  validateParamObjectId('blogId'),
  blogControllers.deleteBlog
);

module.exports = router;
