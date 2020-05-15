const router = require('express').Router();
const commentControllers = require('../controllers/commentControllers');
const { validateComment } = require('../validations/comment');
const { auth } = require('../middleware/auth');
const {
  validateParamObjectId,
} = require('../validations/validateParamObjectId');
const { validate } = require('../middleware/validate');

/*
  @route   POST api/comments/:postId
  @desc    Add a comment
  @access  Private
 */
router.post(
  '/:postId',
  auth,
  validateParamObjectId('postId'),
  validate(validateComment),
  commentControllers.addComment
);

/*
  @route   DELETE api/comments/:commentId
  @desc    Delete a comment
  @access  Private
 */
router.delete('/:commentId', auth, commentControllers.deleteComment);

/*
  @route   GET api/comments/:postId
  @desc    Get post comments
  @access  Public
 */
router.get('/:postId', commentControllers.getPostComments);

module.exports = router;
