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


module.exports = router;
