const router = require('express').Router();
const profileRouter = require('./profile');
const userControllers = require('../controllers/userControllers');
const userValidation = require('../validations/user');
const { auth, multerUploads, validate } = require('../middleware');

router.use('/profile', profileRouter);

/*
@route   PUT api/users
@desc    Update user info
@access  Private
*/
router.put(
  '/',
  auth.required,
  validate(userValidation.validateUser),
  userControllers.updateUser
);

/*
  @route   GET api/users/me
  @desc    Get authorized user
  @access  Private
 */
router.get('/me', auth.required, userControllers.getUser);

/*
  @route   POST api/users/photo
  @desc    Upload user avatar
  @access  Private
 */
router.post(
  '/photo',
  auth.required,
  multerUploads,
  userControllers.uploadPhoto
);

/*
  @route   DELETE api/users/photo
  @desc    Delete user avatar
  @access  Private
 */
router.delete('/photo', auth.required, userControllers.deleteAvatar);

/*
  @route   DELETE api/users
  @desc    Delete user account
  @access  Private
 */
router.delete('/', auth.required, userControllers.deleteAccount);

module.exports = router;
