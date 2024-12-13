const pool = require('../config/database');

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, created_at, updated_at FROM departments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a department by ID
const getDepartmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name, created_at, updated_at FROM departments WHERE dept_id = ?', [id]);

    if (rows.length === 0)
      return res.status(404).json({ error: 'Department not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new department
const createDepartment = async (req, res) => {
  const { dept_code, dept_name, user_id } = req.body;  // Make sure to capture all necessary fields

  try {
    const [result] = await pool.query('INSERT INTO departments (dept_code, dept_name, user_id) VALUES (?, ?, ?)', [dept_code, dept_name, user_id]);
    res.status(201).json({ dept_id: result.insertId, dept_code, dept_name, user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { dept_code, dept_name } = req.body;  // Capture both fields

  try {
    const [result] = await pool.query('UPDATE departments SET dept_code = ?, dept_name = ? WHERE dept_id = ?', [dept_code, dept_name, id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Department not found' });

    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM departments WHERE dept_id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Department not found' });

    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };