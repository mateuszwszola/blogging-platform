const router = require('express').Router();
// const emailRouter = require('./email');
const profileRouter = require('./profile');
const userControllers = require('../controllers/userControllers');
const userValidation = require('../validations/user');
const { auth, multerUploads, validate } = require('../middleware');

// router.use('/user', emailRouter);
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
  @desc    Upload user photo
  @access  Private
 */
router.post(
  '/photo',
  auth.required,
  multerUploads,
  userControllers.uploadPhoto
);

/*
  @route   DELETE api/users
  @desc    Delete user account
  @access  Private
 */
router.delete('/', auth.required, userControllers.deleteUser);

module.exports = router;
