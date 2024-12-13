const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController'); // Added refreshToken import

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login an existing user
router.post('/login', login);

// Refresh the access token
router.post('/refresh-token', refreshToken); // New route for refreshing token

module.exports = router;
