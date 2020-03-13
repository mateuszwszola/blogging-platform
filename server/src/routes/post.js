const router = require('express').Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');
const postValidation = require('../validations/post');

/*
  @route   POST api/posts/:blogId
  @desc    Create a post
  @access  Private
 */
router.post('/:blogId', auth, postValidation.validateCreatePost, postController.createPost);


module.exports = router;
