const { body } = require('express-validator');

exports.validateCreateBlog = [
  body('user', 'userID is required')
    .exists().trim()
    .not()
    .isEmpty(),
  body('name', 'name is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 4, max: 40 })
    .withMessage('The name must be between 4 and 40 chars'),
  body('tags', 'tags are required')
    .exists().trim()
    .not()
    .isEmpty(),
];
