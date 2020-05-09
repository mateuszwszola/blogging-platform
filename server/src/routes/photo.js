const router = require('express').Router();
const { auth } = require('../middleware/auth');
const photoUpload = require('../middleware/photoUpload');
const photoControllers = require('../controllers/photoControllers');

/*
  @route   POST api/photos
  @desc    Add a photo
  @access  Private
 */
router.post(
  '/',
  auth,
  photoUpload.single('photo'),
  photoControllers.uploadPhoto
);

/*
  @route   GET api/photos
  @desc    Get photos
  @access  Public
 */
router.get('/', photoControllers.getPhotos);

/*
  @route   GET api/photos/:id
  @desc    Get photo
  @access  Public
 */
router.get('/:id', photoControllers.getPhoto);

module.exports = router;
