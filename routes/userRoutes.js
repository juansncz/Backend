const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all users - Requires authentication
router.get('/', authenticateToken, async (req, res) => {
  try {
    await getAllUsers(req, res); // Call the controller method
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID - Requires authentication
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    await getUserById(req, res); // Call the controller method
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user - Requires authentication (should probably be only accessible by admins)
router.post('/', authenticateToken, async (req, res) => {
  try {
    await createUser(req, res); // Call the controller method
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user by ID - Requires authentication
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    await updateUser(req, res); // Call the controller method
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user by ID - Requires authentication
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await deleteUser(req, res); // Call the controller method
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
