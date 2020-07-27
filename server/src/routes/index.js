const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./user'));
router.use('/blogs', require('./blog'));
router.use('/posts', require('./post'));
router.use('/comments', require('./comment'));

module.exports = router;
