const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users (adjusted for the new schema)
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, avatar_url, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID (adjusted for the new schema)
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
  const { fullname, username, password, avatar_url } = req.body; // include avatar_url if needed

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullname, username, password, avatar_url) VALUES (?, ?, ?, ?)', [fullname, username, hashedPassword, avatar_url || null]);
    res.status(201).json({ id: result.insertId, fullname, username, avatar_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password, avatar_url } = req.body; // include avatar_url if updating

  try {
    let query = 'UPDATE users SET fullname = ?, username = ?';
    let queryParams = [fullname, username];

    // Only update password if it's provided
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

    res.json({ message: 'User updated successfully' });
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

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };