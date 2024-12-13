const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { fullname, username, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error("Error registering user:", err);  // Added better error logging
        res.status(500).json({ error: 'Server error: Unable to register user' });
    }
};

// Login an existing user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        // Create both access token and refresh token
        const accessToken = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET,  // Using environment variable for the secret key
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }  // Using expiration time from .env
        );

        const refreshToken = jwt.sign(
            { user_id: user.user_id, username: user.username },
            process.env.JWT_SECRET_REFRESH,  // Separate secret for refresh token
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME }  // Expiration time for refresh token from .env
        );

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error("Error during login:", err);  // Error logging improved
        res.status(500).json({ error: 'Server error: Unable to login' });
    }
};

// Refresh the access token using refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

        // Generate a new access token if the refresh token is valid
        const newAccessToken = jwt.sign(
            { user_id: decoded.user_id, username: decoded.username },
            process.env.JWT_SECRET,  // Using the main JWT secret
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME }  // Expiration time for access token
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error during refresh token:", err);  // Better error logging
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};

// Export the functions for use in the routes
module.exports = { register, login, refreshToken };
