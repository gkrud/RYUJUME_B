const express = require('express');
const controller = require('./myPage.controller');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../../../middleware/auth');
let _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname);
    }
});

let upload = multer({ storage: _storage });

//router.post('/writeInfo',authMiddleware,controller.writeInfo);
router.put('/updateInfo',authMiddleware,controller.updateInfo);
router.post('/updateProfileImg',authMiddleware,upload.single('profileImg'),controller.updateProfileImg);
router.get('/readMyInfo',authMiddleware,controller.readMyInfo);
router.get('/readLikeInfo',authMiddleware,controller.readLikeInfo);


module.exports = router;