const pool = require('../config/database');

// Get all messages for a specific conversation
const getAllMessages = async (req, res) => {
  const { conversation_id } = req.params; // Capture conversation_id from request parameters

  try {
    const [rows] = await pool.query(
      'SELECT m.message_id, m.conversation_id, m.sender_id, u.fullname, m.message_text, m.message_time ' +
      'FROM messages m ' +
      'JOIN users u ON u.user_id = m.sender_id ' + 
      'WHERE m.conversation_id = ? ORDER BY m.message_time ASC', // Order by time (ASC for chronological order)
      [conversation_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages.', details: err.message });
  }
};

// Get a message by ID
const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT m.message_id, m.conversation_id, m.sender_id, u.fullname, m.message_text, m.message_time ' +
      'FROM messages m ' +
      'JOIN users u ON u.user_id = m.sender_id ' +
      'WHERE m.message_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve the message.', details: err.message });
  }
};

// Create a new message in a conversation
const createMessage = async (req, res) => {
  const { conversation_id, sender_id, message_text } = req.body;

  if (!conversation_id || !sender_id || !message_text.trim()) {
    return res.status(400).json({ error: 'All fields (conversation_id, sender_id, message_text) are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)',
      [conversation_id, sender_id, message_text]
    );
    res.status(201).json({
      message_id: result.insertId,
      conversation_id,
      sender_id,
      message_text,
      message_time: new Date(), // Include message time for response
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create message.', details: err.message });
  }
};

// Update a message by ID
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { message_text } = req.body;

  if (!message_text.trim()) {
    return res.status(400).json({ error: 'Message text is required for update.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE messages SET message_text = ? WHERE message_id = ?',
      [message_text, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.json({ message: 'Message updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message.', details: err.message });
  }
};

// Delete a message by ID
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM messages WHERE message_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.', details: err.message });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
