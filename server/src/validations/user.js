const { body } = require('express-validator');
const { isURL, isLength } = require('validator');

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
      if (value && !isURL(value)) {
        return false;
      }
      return true;
    }),
];
