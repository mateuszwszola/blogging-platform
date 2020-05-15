const { body } = require('express-validator');
const User = require('../models/User');
const { isURL, isLength } = require('validator');
const { validate } = require('../middleware/validate');

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

exports.validateNewPassword = [
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

exports.validateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage('name must be between 2 and 40 chars'),
  body('bio', 'bio must be between 2 and 100 chars')
    .optional()
    .trim()
    .custom((value) => {
      // user can reset bio
      if (value === '') return true;

      if (value && !isLength(value, { min: 2, max: 100 })) {
        return false;
      }

      return true;
    }),
  body('avatarURL', 'invalid avatar URL')
    .optional()
    .custom((value) => {
      // user can reset avatar URL
      if (value !== '' && !isURL(value)) {
        return false;
      }
      return true;
    }),
];
