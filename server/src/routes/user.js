const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');


/*
  @route   POST api/users
  @desc    Create a new user | Return JWT token
  @access  Public
 */
router.post('/', userController.registerUser);

/*
  @route   POST api/users/login
  @desc    Login a registered user | Return JWT token
  @access  Public
 */
router.post('/login', userController.loginUser);

/*
  @route   GET api/users/me
  @desc    Get a user
  @access  Private
 */
router.get('/me', auth, userController.getUser);


module.exports = router;
