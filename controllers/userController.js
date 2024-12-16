const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, avatar_url, created_at, updated_at FROM users');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, avatar_url, created_at, updated_at FROM users WHERE user_id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { fullname, username, password, avatar_url } = req.body;

  try {
    if (!fullname || !username || !password) {
      return res.status(400).json({ error: 'Fullname, username, and password are required' });
    }

    // Check if username is already taken
    const [existingUser] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password and insert user into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullname, username, password, avatar_url) VALUES (?, ?, ?, ?)', [fullname, username, hashedPassword, avatar_url || null]);

    res.status(201).json({ success: true, message: 'User created successfully', data: { id: result.insertId, fullname, username, avatar_url } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password, avatar_url } = req.body;

  try {
    let query = 'UPDATE users SET fullname = ?, username = ?';
    let queryParams = [fullname, username];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      queryParams.push(hashedPassword);
    }

    if (avatar_url !== undefined) {
      query += ', avatar_url = ?';
      queryParams.push(avatar_url);
    }

    query += ' WHERE user_id = ?';
    queryParams.push(id);

    const [result] = await pool.query(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Search for a user by username
const searchUserByUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const [rows] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user_id if user is found
    res.json({ success: true, data: { user_id: rows[0].user_id } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

// Add a contact
const addContact = async (req, res) => {
  const { user_id, contact_user_id } = req.body;

  try {
    const [userRows] = await pool.query('SELECT user_id FROM users WHERE user_id IN (?, ?)', [user_id, contact_user_id]);

    if (userRows.length < 2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    const [contactExists] = await pool.query(
      'SELECT * FROM contacts WHERE (user_id = ? AND contact_user_id = ?) OR (user_id = ? AND contact_user_id = ?)',
      [user_id, contact_user_id, contact_user_id, user_id]
    );

    if (contactExists.length > 0) {
      return res.status(400).json({ error: 'Contact already exists' });
    }

    await pool.query('INSERT INTO contacts (user_id, contact_user_id) VALUES (?, ?)', [user_id, contact_user_id]);
    res.status(201).json({ success: true, message: 'Contact added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  searchUserByUsername,
  addContact 
};
