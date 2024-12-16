const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationsRoutes = require('./routes/conversationsRoutes'); // Updated
const messageRoutes = require('./routes/messageRoutes');             // Updated
const contactsRoutes = require('./routes/contactsRoutes');          // Updated

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware to handle CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);               // Authentication routes (login/register)
app.use('/api/users', userRoutes);              // User management routes
app.use('/api/conversations', conversationsRoutes); // Updated
app.use('/api/messages', messageRoutes);            // Updated
app.use('/api/contacts', contactsRoutes);           // Updated

// Basic test route to check server functionality
app.get('/', (req, res) => {
    res.send('Server is running. Welcome to the API!');
});

// Set port from environment variables or default to 3000 (adjusted)
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});