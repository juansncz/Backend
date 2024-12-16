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
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullname, username, password, avatar_url) VALUES (?, ?, ?, ?)', [fullname, username, hashedPassword, avatar_url || null]);
    res.status(201).json({ id: result.insertId, fullname, username, avatar_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search for a user by username (new function)
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
    res.json({ user_id: rows[0].user_id });
  } catch (err) {
    console.error("Error searching for user by username:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, searchUserByUsername };
