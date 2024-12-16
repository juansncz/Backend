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
        // Find the user first
        const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        // First, delete all dependent conversations by user_id
        await pool.query('DELETE FROM conversations WHERE user_1_id = ? OR user_2_id = ?', [userId, userId]);

        // Then, delete the user
        await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);

        res.status(200).send({ message: 'User and dependencies deleted successfully' });
    } catch (error) {
        console.error('Error deleting user and dependencies:', error);
        res.status(500).send({ error: 'Failed to delete user' });
    }
});

// New route for searching by username
router.get('/search', authenticateToken, searchUserByUsername);

// New route for adding a contact
router.post('/addContact', authenticateToken, addContact);

module.exports = router;
