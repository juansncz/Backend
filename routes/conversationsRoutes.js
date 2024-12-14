const express = require('express');
const { 
    getAllConversations, 
    getConversationById, 
    createConversation, 
    sendMessage, // added this if you want to use it in your routes
    deleteConversation 
} = require('../controllers/conversationsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Add your routes, making sure the logic in the controllers matches the endpoints you want
router.get('/:user_id', authenticateToken, getAllConversations); // for user-specific conversations
router.get('/:id', authenticateToken, getConversationById); // get specific conversation by id
router.post('/', authenticateToken, createConversation); // create a new conversation
router.post('/message', authenticateToken, sendMessage); // send a message to an existing conversation
router.delete('/:id', authenticateToken, deleteConversation); // delete a conversation by ID

module.exports = router;
