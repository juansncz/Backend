const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { User } = require('./models'); // Assuming User model exists in 'models'

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationsRoutes = require('./routes/conversationsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactsRoutes = require('./routes/contactsRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);               // Authentication routes (login/register)
app.use('/api/users', userRoutes);              // User management routes
app.use('/api/conversations', conversationsRoutes); // Conversations routes
app.use('/api/messages', messageRoutes);            // Messages routes
app.use('/api/contacts', contactsRoutes);           // Contacts routes

// Add /api/users/search route for searching a user by username
app.get('/api/users/search', async (req, res) => {
    const { username } = req.query; // Get the username parameter from the query string
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const user = await User.findOne({ where: { username } }); // Find the user by username
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user is not found
        }
        res.status(200).json(user); // Return the user data if found
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' }); // Handle any internal server errors
    }
});

// Test route to check server functionality
app.get('/', (req, res) => {
    res.status(200).send('Server is running. Welcome to the API!');
});

// Set port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
