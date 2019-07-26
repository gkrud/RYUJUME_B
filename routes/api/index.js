const router = require('express').Router();

router.use('/docs', require('./docs'));
router.use('/auth',require('./auth'));
router.use('/myPage',require('./myPage'));
router.use('/main',require('./main'));

module.exports = router;