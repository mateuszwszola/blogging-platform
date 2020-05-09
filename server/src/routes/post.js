const router = require('express').Router();
const { auth } = require('../middleware/auth');
const postControllers = require('../controllers/postControllers');
const postValidation = require('../validations/post');
const photoUpload = require('../middleware/photoUpload');

/*
  @route   POST api/posts/:blogId
  @desc    Create a post
  @access  Private
 */
router.post(
  '/:blogId',
  auth,
  photoUpload.single('photo'),
  postValidation.validatePost,
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
  photoUpload.single('photo'),
  postValidation.validatePost,
  postControllers.updatePost
);

/*
  @route   DELETE api/posts/:postId
  @desc    Delete a post
  @access  Private
 */
router.delete('/:postId', auth, postControllers.deletePost);

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
router.get('/blog/:blogId', postControllers.getAllBlogPosts);

/*
  @route   GET api/posts/slug/:slug
  @desc    Get post by slug
  @access  Public
 */
router.get('/slug/:slug', postControllers.getPostBySlug);

module.exports = router;
