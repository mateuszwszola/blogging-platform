const router = require('express').Router();
const postControllers = require('../controllers/postControllers');
const postValidation = require('../validations/post');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const Post = require('../models/Post');
const { ErrorHandler } = require('../utils/error');
const { auth, multerUploads, validate } = require('../middleware');

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
  auth.required,
  validateParamObjectId('blogId'),
  multerUploads,
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
  auth.required,
  validateParamObjectId('postId'),
  multerUploads,
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
  auth.required,
  validateParamObjectId('postId'),
  postControllers.deletePost
);

/*
  @route   GET api/posts/all?title=[]?cursor=
  @desc    Get all posts
  @access  Public
 */
router.get('/all', auth.optional, postControllers.getAllPosts);

/*
  @route   GET api/posts?title=[]
  @desc    Get auth user posts
  @access  Private
 */
router.get('/', auth.required, postControllers.getAuthUserPosts);

/*
  @route   GET api/posts/user/:userId?title=[]
  @desc    Get user posts
  @access  Public
 */
router.get(
  '/user/:userId',
  validateParamObjectId('userId'),
  auth.optional,
  postControllers.getUserPosts
);

/*
  @route   GET api/posts/blog/:blogId?title=[]
  @desc    Get blog posts
  @access  Public
 */
router.get(
  '/blog/:blogId',
  validateParamObjectId('blogId'),
  auth.optional,
  postControllers.getBlogPosts
);

/*
  @route   GET api/posts/user/:userId/favorites?title=[]
  @desc    Get user favorites
  @access  Public
 */
router.get(
  '/user/:userId/favorites',
  validateParamObjectId('userId'),
  auth.optional,
  postControllers.getFavorites
);

/*
  @route   GET api/posts/slug/:slug
  @desc    Get post by slug
  @access  Public
 */
router.get('/slug/:slug', auth.optional, postControllers.getPostBySlug);

/*
  @route   POST api/posts/:slug/favorite
  @desc    Favorite post
  @access  Private
 */
router.post('/:slug/favorite', auth.required, postControllers.favorite);

/*
  @route   DELETE api/posts/:slug/favorite
  @desc    Unfavorite post
  @access  Private
 */
router.delete('/:slug/favorite', auth.required, postControllers.unfavorite);

module.exports = router;
