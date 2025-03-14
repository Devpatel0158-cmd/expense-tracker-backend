const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', verifyToken, userController.getUser);
router.put('/', verifyToken, upload.single('profilePic'), userController.updateUser);

module.exports = router;