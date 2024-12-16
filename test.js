const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); // Import for logging (optional but helpful)

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

// Middleware to handle CORS, JSON body parsing, and logging
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));  // This will log requests to the console (in development mode)

// Define API routes
app.use('/api/auth', authRoutes);               // Authentication routes (login/register)
app.use('/api/users', userRoutes);              // User management routes
app.use('/api/conversations', conversationsRoutes); // Conversations routes
app.use('/api/messages', messageRoutes);            // Messages routes
app.use('/api/contacts', contactsRoutes);           // Contacts routes

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
