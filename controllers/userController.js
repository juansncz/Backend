const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password, avatar_url } = req.body;

  try {
    // Start constructing the SQL update query
    let query = 'UPDATE users SET fullname = ?, username = ?';
    let queryParams = [fullname, username];  // Initial values for fullname and username

    // Only update password if it's provided in the request
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      query += ', password = ?';  // Add password field to the query
      queryParams.push(hashedPassword); // Add hashed password to the parameters
    }

    // If avatar_url is provided, include it in the update
    if (avatar_url !== undefined) {
      query += ', avatar_url = ?';  // Add avatar_url field to the query
      queryParams.push(avatar_url); // Add the avatar URL to the parameters
    }

    // Add the condition to target the specific user by ID
    query += ' WHERE user_id = ?';
    queryParams.push(id); // Add user ID to the parameters for the WHERE clause

    // Execute the query with the constructed query string and parameters
    const [result] = await pool.query(query, queryParams);

    // Check if the user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Respond with a success message
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error("Error updating user:", err); // Debugging
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateUser }; // Ensure to export properly
