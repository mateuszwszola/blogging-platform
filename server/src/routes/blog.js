const router = require('express').Router();
const blogControllers = require('../controllers/blogControllers');
const blogValidation = require('../validations/blog');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { auth, multerUploads, validate } = require('../middleware');

/*
  @route   POST api/blogs
  @desc    Create a blog
  @access  Private
 */
router.post(
  '/',
  auth.required,
  multerUploads,
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
  multerUploads,
  validate(blogValidation.validateBlog),
  blogControllers.updateBlog
);

/*
  @route   GET api/blogs?name=[]
  @desc    Get auth user blogs
  @access  Private
 */
router.get('/', auth.required, blogControllers.getAuthUserBlogs);

/*
  @route   GET api/blogs/all?name=[]
  @desc    Get all blogs
  @access  Public
 */
router.get('/all', blogControllers.getAllBlogs);

/*
  @route   GET api/blogs/user/:userId?name=[]
  @desc    Get user blogs
  @access  Public
 */
router.get(
  '/user/:userId',
  validateParamObjectId('userId'),
  blogControllers.getUserBlogs
);

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
