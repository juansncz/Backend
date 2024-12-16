const pool = require('../config/database');

// Get all contacts (users) in the system
const getAllContacts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, email, phone, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a contact by ID
const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT user_id, fullname, email, phone, created_at, updated_at FROM users WHERE user_id = ?', [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new contact (user)
const createContact = async (req, res) => {
  const { fullname, email, phone } = req.body;

  // Check if all required fields are provided
  if (!fullname || !email || !phone) {
    return res.status(400).json({ error: 'All fields (fullname, email, phone) are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (fullname, email, phone) VALUES (?, ?, ?)', 
      [fullname, email, phone]
    );
    res.status(201).json({ user_id: result.insertId, fullname, email, phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a contact by ID
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, phone } = req.body;

  // Check if at least one field is provided for update
  if (!fullname && !email && !phone) {
    return res.status(400).json({ error: 'At least one field (fullname, email, phone) is required for update.' });
  }

  try {
    const updates = [];
    const values = [];

    if (fullname) {
      updates.push('fullname = ?');
      values.push(fullname);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }

    // Add the user_id for the WHERE clause
    values.push(id);

    const [result] = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a contact by ID
const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };