const { body } = require('express-validator');
const Filter = require('bad-words');
const filter = new Filter();

exports.validateBlog = [
  body('name', 'name is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((name) => filter.clean(name))
    .isLength({ min: 2, max: 40 })
    .withMessage('name must be between 2 and 40 characters'),
  body('description')
    .optional()
    .trim()
    .customSanitizer((desc) => filter.clean(desc))
    .isLength({ max: 140 })
    .withMessage('description must be up to 140 characters'),
  body('bgImgUrl', 'invalid img URL').optional().trim().isURL(),
  body('imgAttribution', 'image attribution must be up to 60 chars')
    .optional()
    .trim()
    .isLength({ max: 60 }),
];
