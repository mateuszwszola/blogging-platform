const router = require('express').Router();
const auth = require('../middleware/auth');
const blogController = require('../controllers/blogController');
const blogValidation = require('../validations/blog');

/*
  @route   POST api/blogs
  @desc    Create a blog
  @access  Private
 */
router.post('/', auth, blogValidation.validateCreateBlog, blogController.createBlog);

/*
  @route   GET api/blogs
  @desc    Get auth user blogs
  @access  Private
 */
router.get('/', auth, blogController.getAuthUserBlogs);

/*
  @route   GET api/blogs/all
  @desc    Get all blogs
  @access  Public
 */
router.get('/all', blogController.getAllBlogs);

/*
  @route   GET api/blogs/:blogId
  @desc    Get blog by ID
  @access  Public
 */
router.get('/:blogId', blogController.getBlogById);

/*
  @route   GET api/blogs/slug/:slugName
  @desc    Get a blog by slug name
  @access  Public
 */
router.get('/slug/:slug', blogController.getBlogBySlugName);

/*
  @route   GET api/blogs/user/:userId
  @desc    Get user blogs
  @access  Public
 */
router.get('/user/:userId', blogController.getUserBlogs);

/*
  @route   DELETE api/blogs/:blogId
  @desc    Delete blog
  @access  Private
 */
router.delete('/:blogId', auth, blogController.deleteBlog);

/*
  @route   PUT api/blogs/:blogId
  @desc    Update blog
  @access  Private
 */
router.put('/:blogId', auth, blogValidation.validateUpdateBlog, blogController.updateBlog);

module.exports = router;
