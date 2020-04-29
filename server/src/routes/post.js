const router = require('express').Router();
const { auth } = require('../middleware/auth');
const postController = require('../controllers/postController');
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
  postController.createPost
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
  postController.updatePost
);

/*
  @route   DELETE api/posts/:postId
  @desc    Delete a post
  @access  Private
 */
router.delete('/:postId', auth, postController.deletePost);

/*
  @route   GET api/posts
  @desc    Get user posts
  @access  Private
 */
router.get('/', auth, postController.getUserPosts);

/*
  @route   GET api/posts/all
  @desc    Get all posts
  @access  Public
 */
router.get('/all', postController.getAllPosts);

/*
  @route   GET api/posts/blog/:blogId
  @desc    Get all blog posts
  @access  Public
 */
router.get('/blog/:blogId', postController.getAllBlogPosts);

/*
  @route   GET api/posts/slug/:slug
  @desc    Get post by slug
  @access  Public
 */
router.get('/slug/:slug', postController.getPostBySlug);

module.exports = router;
