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

// DELETE user route (modified to delete user and dependencies)
router.delete('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    try {
        // First delete dependent conversations
        await db.query('DELETE FROM conversations WHERE user_2_id = ?', [userId]);

        // Then delete the user
        await db.query('DELETE FROM users WHERE user_id = ?', [userId]);

        res.status(200).send({ message: 'User and dependencies deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to delete user' });
    }
});

// New route for searching by username
router.get('/search', authenticateToken, searchUserByUsername);

// New route for adding a contact
router.post('/addContact', authenticateToken, addContact);

module.exports = router;
