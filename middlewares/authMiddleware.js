const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = verified; // Attach decoded token info (e.g., user ID) to request
        next(); // Move to the next middleware/route handler
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;