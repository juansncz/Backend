const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  deleteUser, 
  searchUserByUsername 
} = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Existing routes with authentication middleware
router.get('/', authenticateToken, getAllUsers);         // Get all users
router.get('/:id', authenticateToken, getUserById);      // Get a user by ID
router.post('/', authenticateToken, createUser);         // Create a new user
router.delete('/:id', authenticateToken, deleteUser);    // Delete a user

// New route for searching by username with authentication middleware
router.get('/search', authenticateToken, searchUserByUsername);  

module.exports = router;
