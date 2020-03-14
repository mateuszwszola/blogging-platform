const { body } = require('express-validator');

exports.validateCreateBlog = [
  body('name', 'name is required')
    .exists().trim()
    .not()
    .isEmpty()
    .escape()
    .isLength({ min: 4, max: 40 })
    .withMessage('The name must be between 4 and 40 chars'),
  body('description', 'The description must be between 7 and 60 chars')
    .optional()
    .isLength({ min: 7, max: 60 }),
];

exports.validateUpdateBlog = [
  body('name', 'The name must be between 4 and 40 chars')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 4, max: 40 }),
  body('description', 'The description must be between 7 and 60 chars')
    .optional()
    .isLength({ min: 7, max: 60 }),
];
