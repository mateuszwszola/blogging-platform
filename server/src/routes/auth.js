const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const emailControllers = require('../controllers/emailControllers');
const authValidation = require('../validations/auth');
const { validate, auth } = require('../middleware');

/*
  @route   POST api/auth/signup
  @desc    Create a new user | Return JWT token
  @access  Public
 */
router.post(
  '/signup',
  validate(authValidation.validateRegister),
  authControllers.registerUser
);

/*
  @route   POST api/auth/signin
  @desc    Login a registered user | Return JWT token
  @access  Public
   */
router.post(
  '/signin',
  validate(authValidation.validateLogin),
  authControllers.loginUser
);

/*
  @route   POST api/auth/user/email
  @desc    Send password reset email
  @access  Public
 */
router.post('/user/email', emailControllers.sendPasswordResetEmail);

/*
  @route   POST api/auth/user/receive_new_password/:userId/:token
  @desc    Receive new password
  @access  Public
 */
router.post(
  '/user/receive_new_password/:userId/:token',
  authValidation.validateNewPassword,
  emailControllers.receiveNewPassword
);

/*
  @route   POST api/auth/user/password
  @desc    Update user password
  @access  Private
 */
router.post(
  '/user/password',
  auth.required,
  validate(authValidation.validatePasswordUpdate),
  authControllers.updatePassword
);

module.exports = router;
