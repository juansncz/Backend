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

// Existing routes
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

// New route for searching by username
router.get('/search', authenticateToken, searchUserByUsername);

// New route for adding a contact
router.post('/addContact', authenticateToken, addContact);

module.exports = router;
