const router = require('express').Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');
const { validateComment } = require('../validations/comment');

/*
  @route   POST api/comments/:postId
  @desc    Add a comment
  @access  Private
 */
router.post('/:postId', auth, validateComment, commentController.addComment);

/*
  @route   DELETE api/comments/:commentId
  @desc    Delete a comment
  @access  Private
 */
router.delete('/:commentId', auth, commentController.deleteComment);

/*
  @route   GET api/comments/:postId
  @desc    Get post comments
  @access  Public
 */
router.get('/:postId', commentController.getPostComments);

module.exports = router;
