const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const authValidation = require('../validations/auth');
const { validate } = require('../middleware');

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

module.exports = router;
