const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  searchUserByUsername, 
  addContact 
} = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all users - Requires authentication
router.get('/', authenticateToken, getAllUsers);

// Get a user by ID - Requires authentication
router.get('/:id', authenticateToken, getUserById);

// Create a new user - Requires authentication
router.post('/', authenticateToken, createUser);

// Update a user - Requires authentication
router.put('/:id', authenticateToken, updateUser);

// Delete a user - Requires authentication
router.delete('/:id', authenticateToken, deleteUser);

// Search for a user by username - Requires authentication
router.get('/search', authenticateToken, searchUserByUsername);

// Add a contact to the user - Requires authentication
router.post('/addContact', authenticateToken, addContact);

module.exports = router;
