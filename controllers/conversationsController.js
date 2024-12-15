const pool = require('../config/database');

// Get all conversations for a specific user
const getAllConversations = async (req, res) => {
  const { user_id } = req.params; // Capture user_id from request parameters

  try {
    const [rows] = await pool.query(
      'SELECT c.conversation_id, c.user_1_id, c.user_2_id, u1.fullname AS user_1_name, u2.fullname AS user_2_name, c.created_at ' +
      'FROM conversations c ' +
      'JOIN users u1 ON u1.user_id = c.user_1_id ' +
      'JOIN users u2 ON u2.user_id = c.user_2_id ' +
      'WHERE c.user_1_id = ? OR c.user_2_id = ? ORDER BY c.created_at DESC',
      [user_id, user_id]
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
      'SELECT c.conversation_id, c.user_1_id, c.user_2_id, u1.fullname AS user_1_name, u2.fullname AS user_2_name, c.created_at ' +
      'FROM conversations c ' +
      'JOIN users u1 ON u1.user_id = c.user_1_id ' +
      'JOIN users u2 ON u2.user_id = c.user_2_id ' +
      'WHERE c.conversation_id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new conversation
const createConversation = async (req, res) => {
  const { user_1_id, user_2_id } = req.body; // Capture participants' user IDs

  // Ensure both user IDs are provided
  if (!user_1_id || !user_2_id) {
    return res.status(400).json({ error: 'Both user_1_id and user_2_id are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO conversations (user_1_id, user_2_id) VALUES (?, ?)',
      [user_1_id, user_2_id]
    );
    res.status(201).json({ conversation_id: result.insertId, user_1_id, user_2_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message in a conversation
const sendMessage = async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  // Validate required fields
  if (!conversation_id || !sender_id || !message) {
    return res.status(400).json({ error: 'conversation_id, sender_id, and message are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)',
      [conversation_id, sender_id, message]
    );
    res.status(201).json({ message_id: result.insertId, conversation_id, sender_id, message });
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
  sendMessage, // Exported new function
  deleteConversation,
};
