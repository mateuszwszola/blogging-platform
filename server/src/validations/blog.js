const { body } = require('express-validator');
const { isURL, isLength } = require('validator');
const Filter = require('bad-words');
const filter = new Filter();

exports.validateBlog = [
  body('name', 'name is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 40 })
    .withMessage('The name must be between 2 and 40 chars')
    .customSanitizer((name) => filter.clean(name)),
  body('description', 'description is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 140 })
    .withMessage('The description must be between 2 and 140 chars')
    .customSanitizer((desc) => filter.clean(desc)),
  body('bgImg', 'invalid img URL')
    .trim()
    .custom((value) => {
      if (value && !isURL(value)) {
        return false;
      }
      return true;
    }),
  body('imgAttribution', 'The img attribution must be between 2 and 60 chars')
    .trim()
    .custom((value) => {
      if (value && !isLength(value, { min: 2, max: 60 })) {
        return false;
      }
      return true;
    }),
];
