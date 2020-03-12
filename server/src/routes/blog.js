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
  @route   GET api/blog/:name
  @desc    Get a blog by name
  @access  Public
 */
router.get('/:slug', blogController.getBlogBySlugName);

module.exports = router;
