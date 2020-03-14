const { body } = require('express-validator');

exports.validateComment = [
  body('body', 'body is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 1, max: 255 })
    .withMessage('The body must be between 1 and 255 chars'),
];
