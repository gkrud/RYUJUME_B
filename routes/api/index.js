const router = require('express').Router();

router.use('/docs', require('./docs'));

module.exports = router;