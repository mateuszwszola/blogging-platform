const { body } = require('express-validator');
const User = require('../models/User');

exports.validateRegister = [
  body('name', 'name is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 2, max: 20 })
    .withMessage('The name must be between 2 and 20 chars'),
  body('email', 'email is required')
    .exists().trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('invalid email address')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('e-mail already exists');
      }
      return user;
    })
    .normalizeEmail(),
  body('password', 'password is required')
    .exists().trim()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The password must have min 7 characters'),
];

exports.validateLogin = [
  body('email', 'email is required')
    .exists().not().isEmpty(),
  body('password', 'password is required')
    .exists().not().isEmpty(),
];
