const router = require('express').Router();
const emailControllers = require('../controllers/emailControllers');
const { validateNewPassword } = require('../validations/user');

/*
  @route   POST api/users/user/email
  @desc    Send password reset email
  @access  Public
 */
router.post('/email', emailControllers.sendPasswordResetEmail);

/*
  @route   POST api/users/user/receive_new_password/:userId/:token
  @desc    Receive new password
  @access  Public
 */
router.post(
  '/receive_new_password/:userId/:token',
  validateNewPassword,
  emailControllers.receiveNewPassword
);

module.exports = router;
