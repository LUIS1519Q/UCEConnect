const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.get('/', authMiddleware, notificationController.list);
router.patch('/:id/read', authMiddleware, notificationController.markRead);

module.exports = router;
