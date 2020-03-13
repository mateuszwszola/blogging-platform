const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/blogs', require('./blog'));
router.use('/posts', require('./post'));

module.exports = router;
