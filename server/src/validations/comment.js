const { body } = require('express-validator');
const Filter = require('bad-words');
const filter = new Filter();

exports.validateComment = [
  body('body', 'comment body is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((name) => filter.clean(name))
    .isLength({ max: 255 })
    .withMessage('comment body must be up to 255 characters'),
];
