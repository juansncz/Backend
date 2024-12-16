const pool = require('../config/database');

// Get all conversations for a user
const getAllConversations = async (req, res) => {
  const { user_id } = req.params;  // Capture user_id from request parameters

  try {
    const [rows] = await pool.query(
      'SELECT c.conversation_id, c.user_id, u.fullname, c.created_at ' +
      'FROM conversations c ' +
      'JOIN users u ON u.user_id = c.user_id ' +
      'WHERE c.user_id = ? ORDER BY c.created_at DESC',
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a conversation by ID
const getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT conversation_id, user_id, fullname, message, created_at ' +
      'FROM messages m ' +
      'JOIN users u ON u.user_id = m.user_id ' +
      'WHERE m.conversation_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new conversation
const createConversation = async (req, res) => {
  const { user_id, message } = req.body;  // Capture necessary fields

  try {
    const [result] = await pool.query(
      'INSERT INTO conversations (user_id, message) VALUES (?, ?)',
      [user_id, message]
    );
    res.status(201).json({ conversation_id: result.insertId, user_id, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a new message in a conversation
const sendMessage = async (req, res) => {
  const { conversation_id, user_id, message } = req.body;  // Capture fields

  try {
    const [result] = await pool.query(
      'INSERT INTO messages (conversation_id, user_id, message) VALUES (?, ?, ?)',
      [conversation_id, user_id, message]
    );
    res.status(201).json({ message_id: result.insertId, conversation_id, user_id, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a conversation by ID
const deleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM conversations WHERE conversation_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllConversations,
  getConversationById,
  createConversation,
  sendMessage,
  deleteConversation,
};