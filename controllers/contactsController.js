const pool = require('../config/database');

// Get all contacts for a specific user
const getAllContacts = async (req, res) => {
  const { user_id } = req.params; // Capture user_id from request parameters

  try {
    const [rows] = await pool.query(
      'SELECT c.contact_id, c.user_id, c.contact_user_id, u.fullname AS contact_name, c.created_at ' +
      'FROM contacts c ' +
      'JOIN users u ON u.user_id = c.contact_user_id ' +
      'WHERE c.user_id = ?',
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific contact relationship by contact_id
const getContactById = async (req, res) => {
  const { contact_id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT c.contact_id, c.user_id, c.contact_user_id, u.fullname AS contact_name, c.created_at ' +
      'FROM contacts c ' +
      'JOIN users u ON u.user_id = c.contact_user_id ' +
      'WHERE c.contact_id = ?',
      [contact_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new contact for a user
const createContact = async (req, res) => {
  const { user_id, contact_user_id } = req.body;

  // Check if all required fields are provided
  if (!user_id || !contact_user_id) {
    return res.status(400).json({ error: 'Both user_id and contact_user_id are required.' });
  }

  try {
    // Check if contact already exists between the user and the contact user
    const [existingContact] = await pool.query(
      'SELECT * FROM contacts WHERE user_id = ? AND contact_user_id = ?',
      [user_id, contact_user_id]
    );

    if (existingContact.length > 0) {
      return res.status(400).json({ error: 'This contact already exists.' });
    }

    // Insert the new contact into the contacts table
    const [result] = await pool.query(
      'INSERT INTO contacts (user_id, contact_user_id) VALUES (?, ?)',
      [user_id, contact_user_id]
    );
    res.status(201).json({ contact_id: result.insertId, user_id, contact_user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a contact by contact_id (e.g., changing the contact_user_id)
const updateContact = async (req, res) => {
  const { contact_id } = req.params;
  const { contact_user_id } = req.body;

  if (!contact_user_id) {
    return res.status(400).json({ error: 'contact_user_id is required for update.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE contacts SET contact_user_id = ? WHERE contact_id = ?',
      [contact_user_id, contact_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a contact by contact_id
const deleteContact = async (req, res) => {
  const { contact_id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE contact_id = ?', [contact_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllContacts, getContactById, createContact, updateContact, deleteContact };
