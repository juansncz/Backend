const express = require('express');
const { getAllContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllContacts);
router.get('/:id', authenticateToken, getContactById);
router.post('/', authenticateToken, createContact);
router.put('/:id', authenticateToken, updateContact);
router.delete('/:id', authenticateToken, deleteContact);

module.exports = router;