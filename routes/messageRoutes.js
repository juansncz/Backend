const express = require('express');
const { getAllMessages, getMessageById, createMessage, updateMessage, deleteMessage } = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes for messages
router.get('/conversation/:conversation_id', authenticateToken, getAllMessages); // Get all messages in a conversation
router.get('/:message_id', authenticateToken, getMessageById); // Get a specific message by message_id
router.post('/', authenticateToken, createMessage); // Create a new message
router.put('/:message_id', authenticateToken, updateMessage); // Update a specific message by message_id
router.delete('/:message_id', authenticateToken, deleteMessage); // Delete a message by message_id

module.exports = router;
