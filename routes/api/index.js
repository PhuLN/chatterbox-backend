const router = require('express').Router();

router.use('/', require('./users'));
router.use('/chatrooms', require('./chatrooms'));
router.use('/chat', require('./chat'));

module.exports = router;