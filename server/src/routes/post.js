const router = require('express').Router();
const postControllers = require('../controllers/postControllers');
const postValidation = require('../validations/post');
const photoUpload = require('../middleware/photoUpload');
const { auth } = require('../middleware/auth');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { validate } = require('../middleware/validate');

/*
  @route   POST api/posts/:blogId
  @desc    Create a post
  @access  Private
 */
router.post(
  '/:blogId',
  auth,
  validateParamObjectId('blogId'),
  photoUpload.single('photo'),
  validate(postValidation.validatePost),
  postControllers.createPost
);

/*
  @route   PUT api/posts/:postId
  @desc    Update a post
  @access  Private
 */
router.put(
  '/:postId',
  auth,
  validateParamObjectId('postId'),
  photoUpload.single('photo'),
  validate(postValidation.validatePost),
  postControllers.updatePost
);

/*
  @route   DELETE api/posts/:postId
  @desc    Delete a post
  @access  Private
 */
router.delete(
  '/:postId',
  auth,
  validateParamObjectId('postId'),
  postControllers.deletePost
);

/*
  @route   GET api/posts
  @desc    Get user posts
  @access  Private
 */
router.get('/', auth, postControllers.getUserPosts);

/*
  @route   GET api/posts/all
  @desc    Get all posts
  @access  Public
 */
router.get('/all', postControllers.getAllPosts);

/*
  @route   GET api/posts/blog/:blogId
  @desc    Get all blog posts
  @access  Public
 */
router.get(
  '/blog/:blogId',
  validateParamObjectId('blogId'),
  postControllers.getAllBlogPosts
);

/*
  @route   GET api/posts/slug/:slug
  @desc    Get post by slug
  @access  Public
 */
router.get('/slug/:slug', postControllers.getPostBySlug);

module.exports = router;
