const router = require('express').Router();
const userController = require('../controllers/userController');
const userValidation = require('../validations/user');
const auth = require('../middleware/auth');

/*
  @route   POST api/users
  @desc    Create a new user | Return JWT token
  @access  Public
 */
router.post('/', userValidation.validateRegister, userController.registerUser);

/*
  @route   POST api/users/login
  @desc    Login a registered user | Return JWT token
  @access  Public
 */
router.post('/login', userValidation.validateLogin, userController.loginUser);

/*
  @route   GET api/users/me
  @desc    Get a user
  @access  Private
 */
router.get('/me', auth, userController.getUser);

/*
  @route   POST api/users/me/logout
  @desc    Log the user out of the application
  @access  Private
 */
router.post('/me/logout', auth, userController.logout);

/*
  @route   POST api/users/me/logoutall
  @desc    Log the user out of all devices | Remove all tokens
  @access  Private
 */
router.post('/me/logoutall', auth, userController.logoutAll);

module.exports = router;
