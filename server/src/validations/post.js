const { body } = require('express-validator');
const { isLength } = require('validator');
const Filter = require('bad-words');
const filter = new Filter();

exports.validatePost = [
  body('title', 'title is required')
    .exists()
    .trim()
    .not()
    .isEmpty()
    .customSanitizer((title) => filter.clean(title))
    .isLength({ min: 2, max: 60 })
    .withMessage('title must be between 2 and 60 chars'),
  body('body', 'post body is required').exists().trim().not().isEmpty(),
  body('bgImgUrl', 'invalid img URL').optional().trim().isURL(),
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
