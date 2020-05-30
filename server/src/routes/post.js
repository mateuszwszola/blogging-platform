const router = require('express').Router();
const postControllers = require('../controllers/postControllers');
const postValidation = require('../validations/post');
const photoUpload = require('../middleware/photoUpload');
const { auth } = require('../middleware/auth');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { validate } = require('../middleware/validate');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');

// Preload post on routes with ':slug'
router.param('slug', async (req, res, next, slug) => {
  try {
    const post = await Post.findOne({ slug });

    if (!post) {
      throw new ErrorHandler(404, 'Post not found');
    }

    req.post = post;

    return next();
  } catch (err) {
    next(err);
  }
});

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
  @desc    Get auth user posts
  @access  Private
 */
router.get('/', auth, postControllers.getAuthUserPosts);

/*
  @route   GET api/posts/all
  @desc    Get all posts
  @access  Public
 */
router.get('/all', postControllers.getAllPosts);

/*
  @route   GET api/posts/user/:userId
  @desc    Get userId posts
  @access  Public
 */
router.get(
  '/user/:userId',
  postControllers.getAllPosts,
  validateParamObjectId('userId'),
  postControllers.getUserPosts
);

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

/*
  @route   POST api/posts/:slug/favorite
  @desc    Favorite post
  @access  Private
 */
router.post('/:slug/favorite', auth, postControllers.favorite);

/*
  @route   DELETE api/posts/:slug/favorite
  @desc    Unfavorite post
  @access  Private
 */
router.delete('/:slug/favorite', auth, postControllers.unfavorite);

module.exports = router;
