const pool = require('../config/database');

// Get all messages for a specific conversation
const getAllMessages = async (req, res) => {
  const { conversation_id } = req.params;  // Capture conversation_id from request parameters

  try {
    const [rows] = await pool.query(
      'SELECT m.message_id, m.conversation_id, m.sender_id, u.fullname, m.message, m.created_at ' +
      'FROM messages m ' +
      'JOIN users u ON u.sender_id = m.sender_id ' +
      'WHERE m.conversation_id = ? ORDER BY m.created_at DESC',
      [conversation_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a message by ID
const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT message_id, conversation_id, sender_id, fullname, message, created_at ' +
      'FROM messages m ' +
      'JOIN users u ON u.sender_id = m.sender_id ' +
      'WHERE m.message_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new message in a conversation
const createMessage = async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  // Check if all required fields are provided
  if (!conversation_id || !sender_id || !message) {
    return res.status(400).json({ error: 'All fields (conversation_id, sender_id, message) are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)',
      [conversation_id, sender_id, message]
    );
    res.status(201).json({
      message_id: result.insertId,
      conversation_id,
      sender_id,
      message,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a message by ID
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required for update.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE messages SET message = ? WHERE message_id = ?',
      [message, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM messages WHERE message_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMessages, getMessageById, createMessage, updateMessage, deleteMessage };