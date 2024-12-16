const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, avatar_url, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, avatar_url, created_at, updated_at FROM users WHERE user_id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { fullname, username, password, avatar_url } = req.body;

  try {
    const [existingUser] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullname, username, password, avatar_url) VALUES (?, ?, ?, ?)', [fullname, username, hashedPassword, avatar_url || null]);

    res.status(201).json({ id: result.insertId, fullname, username, avatar_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete a user and their associated conversations
const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete user with ID:", id);  // Log the id to debug

  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("Error deleting user:", err);  // More verbose logging
    res.status(500).json({ error: err.message });
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
    res.status(201).json({ message: 'Contact added successfully' });
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
