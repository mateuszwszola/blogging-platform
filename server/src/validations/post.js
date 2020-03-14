const { body } = require('express-validator');

exports.validateCreatePost = [
  body('title', 'title is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 1, max: 60 })
    .withMessage('The title max chars is 60'),
  body('body', 'body is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape(),
];
