const router = require('express').Router();
const { Blog } = require('../models');
const blogControllers = require('../controllers/blogControllers');
const blogValidation = require('../validations/blog');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { auth, multerUploads, validate } = require('../middleware');
const { ErrorHandler } = require('../utils/error');

router.param('userId', validateParamObjectId('userId'));
router.param('blogId', validateParamObjectId('blogId'));

// Preload post on routes with :blogId
router.param('blogId', async (req, res, next, blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ErrorHandler(404, `Blog with ${blogId} ID not found`);
  }

  req.blog = blog;
  return next();
});

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
  @route   GET api/blogs/all?name=[]?cursor=0
  @desc    Get all blogs
  @access  Public
 */
router.get('/all', blogControllers.getAllBlogs);

/*
  @route   GET api/blogs/bookmarks
  @desc    Get user's bookmarked blogs
  @access  Private
 */
router.get('/bookmarks', auth.required, blogControllers.getBookmarks);

/*
  @route   GET api/blogs/user/:userId?name=[]
  @desc    Get user blogs
  @access  Public
 */
router.get('/user/:userId', blogControllers.getUserBlogs);

/*
  @route   GET api/blogs/:blogId
  @desc    Get blog by ID
  @access  Public
 */
router.get('/:blogId', blogControllers.getBlogById);

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
router.delete('/:blogId', auth.required, blogControllers.deleteBlog);

/*
  @route   DELETE api/blogs/:blogId/image
  @desc    Remove blog background image
  @access  Private
*/
router.delete('/:blogId/image', auth.required, blogControllers.deleteImage);

/*
  @route   POST api/blogs/:blogId/bookmark
  @desc    Bookmark a blog (Add it to user's reading list)
  @access  Private
 */
router.post('/:blogId/bookmark', auth.required, blogControllers.bookmark);

/*
  @route   DELETE api/blogs/:blogId/bookmark
  @desc    Unbookmark a blog (Remove it from user's reading list)
  @access  Private
 */
router.delete('/:blogId/bookmark', auth.required, blogControllers.unbookmark);

module.exports = router;
