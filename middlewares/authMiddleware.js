const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token expired
        return res.status(401).json({ error: 'Token expired. Please refresh your token.' });
      }
      return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = decoded; // Attach decoded token info to request
    next(); // Proceed with the request
  });
};

module.exports = authenticateToken;
