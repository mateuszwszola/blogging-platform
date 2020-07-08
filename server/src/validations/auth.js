const { body } = require('express-validator');
const User = require('../models/User');

exports.validateRegister = [
  body('name', 'name is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 40 })
    .withMessage('The name must be between 2 and 40 chars'),
  body('email', 'email is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('invalid email address')
    .custom((email) => {
      return User.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject('e-mail already in use');
        }
      });
    }),
  body('password', 'password is required')
    .exists()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The password must have min 7 characters'),
];

exports.validateLogin = [
  body('email', 'email is required').exists().not().isEmpty(),
  body('password', 'password is required').exists().not().isEmpty(),
];

exports.validateNewPassword = [
  body('password', 'password is required')
    .exists()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The password must have min 7 characters'),
];

exports.validatePasswordUpdate = [
  body('currentPassword', 'current password is required')
    .exists()
    .not()
    .isEmpty(),
  body('newPassword', 'new password is required')
    .exists()
    .not()
    .isEmpty()
    .isLength({ min: 7 })
    .withMessage('The new password must have min 7 characters'),
];
