const express = require('express');
const { getAllConversations, getConversationById, createConversation, updateConversation, deleteConversation } = require('../controllers/conversationsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllConversations);
router.get('/:id', authenticateToken, getConversationById);
router.post('/', authenticateToken, createConversation);
router.put('/:id', authenticateToken, updateConversation);
router.delete('/:id', authenticateToken, deleteConversation);

module.exports = router;
