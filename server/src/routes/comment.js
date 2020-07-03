const router = require('express').Router();
const commentControllers = require('../controllers/commentControllers');
const { validateComment } = require('../validations/comment');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { auth, validate } = require('../middleware');

/*
  @route   POST api/comments/:postId
  @desc    Add a comment
  @access  Private
 */
router.post(
  '/:postId',
  auth.required,
  validateParamObjectId('postId'),
  validate(validateComment),
  commentControllers.addComment
);

/*
  @route   DELETE api/comments/:commentId
  @desc    Delete a comment
  @access  Private
 */
router.delete('/:commentId', auth.required, commentControllers.deleteComment);

/*
  @route   GET api/comments/:postId
  @desc    Get post comments
  @access  Public
 */
router.get('/:postId', commentControllers.getPostComments);

module.exports = router;
