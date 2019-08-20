const express = require('express');
const controller = require('./main.controller');
const router = express.Router();
const authMiddleware = require('../../../middleware/auth');

router.get('/latestInfo',authMiddleware,controller.latestInfo);
router.get('/detail/:_id',authMiddleware,controller.infoDetail);
router.get('/likeInfo',authMiddleware,controller.likeInfo);

module.exports = router;