const express = require('express');
const { 
  getAllConversations, 
  getConversationById, 
  createConversation, 
  sendMessage, 
  deleteConversation 
} = require('../controllers/conversationsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes for conversations
router.get('/user/:user_id', authenticateToken, getAllConversations); // Get all conversations for a specific user
router.get('/:conversation_id', authenticateToken, getConversationById); // Get specific conversation by conversation_id
router.post('/', authenticateToken, createConversation); // Create a new conversation
router.post('/message', authenticateToken, sendMessage); // Send a message to a conversation
router.delete('/:conversation_id', authenticateToken, deleteConversation); // Delete a conversation by conversation_id

module.exports = router;
