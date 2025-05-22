const pool = require('../db');

exports.getTasks = async (req, res) => {
  const { userId } = req.query;
  try {
    const q = await pool.query(
      'SELECT * FROM tareas WHERE usuario_id = $1 ORDER BY fecha DESC',
      [userId]
    );
    res.json(q.rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

exports.createTask = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const q = await pool.query(
      'INSERT INTO tareas (usuario_id, texto) VALUES ($1, $2) RETURNING *',
      [userId, text]
    );
    res.json(q.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
};

exports.toggleTask = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const q = await pool.query(
      `UPDATE tareas SET completada = NOT completada WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json(q.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    const q = await pool.query(
      `DELETE FROM tareas WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

// Editar tarea
exports.editTask = async (req, res) => {
  const { userId, text } = req.body;
  const { id } = req.params;
  try {
    const q = await pool.query(
      `UPDATE tareas SET texto = $1 WHERE id = $2 AND usuario_id = $3 RETURNING *`,
      [text, id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json(q.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al editar tarea' });
  }
};
