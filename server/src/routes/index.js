const router = require('express').Router();

router.use('/users', require('./user'));

module.exports = router;
