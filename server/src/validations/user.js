const { body } = require('express-validator');
const User = require('../models/User');

exports.validateRegister = [
  body('name', 'name is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 2, max: 40 })
    .withMessage('The name must be between 2 and 40 chars'),
  body('email', 'email is required')
    .exists()
    .trim()
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
    }),
  body('password', 'password is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The password must have min 7 characters'),
  body('bio', 'The bio must be between 2 and 100 chars')
    .optional()
    .isLength({ min: 2, max: 100 }),
];

exports.validateNewPassword = [
  body('password', 'password is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The password must have min 7 characters'),
];

exports.validateLogin = [
  body('email', 'email is required').exists().not().isEmpty(),
  body('password', 'password is required').exists().not().isEmpty(),
];

exports.validateUser = [
  body('name', 'The name must be between 2 and 40 chars')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 40 }),
  body('bio', 'The bio must be between 2 and 100 chars')
    .optional()
    .trim()
    .isLength({ max: 100 }), // user can reset their bio
];
