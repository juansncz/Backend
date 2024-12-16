const express = require('express');
const { getAllMessages, getMessageById, createMessage, updateMessage, deleteMessage } = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllMessages);
router.get('/:id', authenticateToken, getMessageById);
router.post('/', authenticateToken, createMessage);
router.put('/:id', authenticateToken, updateMessage);
router.delete('/:id', authenticateToken, deleteMessage);

module.exports = router;