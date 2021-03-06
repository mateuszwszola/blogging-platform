const router = require('express').Router();
const profileControllers = require('../controllers/profileControllers');
const User = require('../models/User');
const { auth } = require('../middleware');
const { ErrorHandler } = require('../utils/error');

// Preload user profile on routes with ':userId'
router.param('userId', async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorHandler(404, 'User not found');
    }

    req.profile = user;

    next();
  } catch (err) {
    next(err);
  }
});

/*
  @route   GET api/users/profile
  @desc    Get all profiles
  @access  Public
 */
router.get('/', auth.optional, profileControllers.getProfiles);

/*
  @route   GET api/users/profile/:userId
  @desc    Get user profile by Id
  @access  Public
 */
router.get('/:userId', auth.optional, profileControllers.getUserProfileById);

/*
  @route   GET api/users/profile/:userId/following
  @desc    Get profile's list of followed user
  @access  Public
 */
router.get(
  '/:userId/following',
  auth.optional,
  profileControllers.getFollowing
);

/*
  @route   POST api/users/profile/:userId/follow
  @desc    Follow user
  @access  Private
 */
router.post('/:userId/follow', auth.required, profileControllers.follow);

/*
  @route   DELETE api/users/profile/:userId/follow
  @desc    Unfollow user
  @access  Private
 */
router.delete('/:userId/follow', auth.required, profileControllers.unfollow);

module.exports = router;
