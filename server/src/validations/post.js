const { body } = require('express-validator');
const { isURL, isLength } = require('validator');
const Filter = require('bad-words');
const filter = new Filter();

exports.validatePost = [
  body('title', 'title is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 60 })
    .withMessage('The title must be between 2 and 60 chars')
    .customSanitizer((title) => filter.clean(title)),
  body('body', 'body is required').exists().trim().not().isEmpty(),
  body('bgImgUrl', 'invalid img URL')
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
  body('tags')
    .optional()
    .customSanitizer((value) => {
      return value.split(',').map((t) => filter.clean(t.trim()));
    }),
];
