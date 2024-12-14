const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get the Authorization header (e.g., "Bearer <token>")
  const authHeader = req.headers['authorization']; 
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object for further use
    req.user = verified; 

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If the token is invalid or expired, return 403 Forbidden
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
