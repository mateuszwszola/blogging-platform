const router = require('express').Router();
const auth = require('../middleware/auth');
const photoUpload = require('../middleware/photoUpload');
const photoController = require('../controllers/photoController');

/*
  @route   POST api/photos
  @desc    Add a photo
  @access  Private
 */
router.post(
  '/',
  auth,
  photoUpload.single('photo'),
  photoController.uploadPhoto
);

/*
  @route   GET api/photos
  @desc    Get photos
  @access  Public
 */
router.get('/', photoController.getPhotos);

/*
  @route   GET api/photos/:id
  @desc    Get photo
  @access  Public
 */
router.get('/:id', photoController.getPhoto);

module.exports = router;
