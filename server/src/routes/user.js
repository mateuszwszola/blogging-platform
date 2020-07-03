const router = require('express').Router();
// const emailRouter = require('./email');
const profileRouter = require('./profile');
const userControllers = require('../controllers/userControllers');
const userValidation = require('../validations/user');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { multerUploads } = require('../middleware/multer');

// router.use('/user', emailRouter);
router.use('/profile', profileRouter);

/*
  @route   POST api/users
  @desc    Create a new user | Return JWT token
  @access  Public
 */
router.post(
  '/',
  validate(userValidation.validateRegister),
  userControllers.registerUser
);

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
    @route   POST api/users/login
    @desc    Login a registered user | Return JWT token
    @access  Public
   */
router.post(
  '/login',
  validate(userValidation.validateLogin),
  userControllers.loginUser
);

/*
  @route   GET api/users/me
  @desc    Get a user
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

module.exports = router;
