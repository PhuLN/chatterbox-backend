const router = require('express').Router();

router.use('/', require('./users'));
router.use('/chatrooms', require('./chatrooms'));

module.exports = router;