const router = require('express').Router();
const profileControllers = require('../controllers/profileControllers');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
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
  @route   GET api/users/profile/:userId
  @desc    Get user profile by Id
  @access  Public
 */
router.get('/:userId', profileControllers.getUserProfileById);

/*
  @route   POST api/users/:userId/follow
  @desc    Follow user
  @access  Private
 */
router.post('/:userId/follow', auth.required, profileControllers.follow);

/*
  @route   DELETE api/users/:userId/follow
  @desc    Unfollow user
  @access  Private
 */
router.delete('/:userId/follow', auth.required, profileControllers.unfollow);

module.exports = router;
