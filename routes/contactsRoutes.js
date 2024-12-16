const express = require('express');
const { getAllContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contactsController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes for contacts
router.get('/:user_id', authenticateToken, getAllContacts); // Get all contacts for a specific user
router.get('/contact/:contact_id', authenticateToken, getContactById); // Get a specific contact by contact_id
router.post('/', authenticateToken, createContact); // Create a new contact
router.put('/:contact_id', authenticateToken, updateContact); // Update an existing contact by contact_id
router.delete('/:contact_id', authenticateToken, deleteContact); // Delete a contact by contact_id

module.exports = router;