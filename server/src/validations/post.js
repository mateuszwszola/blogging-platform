const { body } = require('express-validator');

exports.validateCreatePost = [
  body('title', 'title is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape(),
  body('body', 'body is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape(),
];
