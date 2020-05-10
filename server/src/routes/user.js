const router = require('express').Router();
const userControllers = require('../controllers/userControllers');
const userValidation = require('../validations/user');
const { auth } = require('../middleware/auth');
const photoUpload = require('../middleware/photoUpload');
const emailRouter = require('./email');

router.use('/user', emailRouter);

/*
  @route   POST api/users
  @desc    Create a new user | Return JWT token
  @access  Public
 */
router.post('/', userValidation.validateRegister, userControllers.registerUser);

/*
  @route   PUT api/users
  @desc    Update user info
  @access  Private
 */
router.put('/', auth, userValidation.validateUser, userControllers.updateUser);

/*
  @route   POST api/users/login
  @desc    Login a registered user | Return JWT token
  @access  Public
 */
router.post('/login', userValidation.validateLogin, userControllers.loginUser);

/*
  @route   GET api/users/me
  @desc    Get a user
  @access  Private
 */
router.get('/me', auth, userControllers.getUser);

/*
  @route   POST api/users/photo
  @desc    Upload user photo
  @access  Private
 */
router.post(
  '/photo',
  auth,
  photoUpload.single('photo'),
  userControllers.uploadPhoto
);

module.exports = router;
