const { body } = require('express-validator');

exports.validatePost = [
  body('title', 'title is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 1, max: 60 })
    .withMessage('The title must be between 1 and 60 chars'),
  body('body', 'body is required').exists().trim().not().isEmpty(),
];
