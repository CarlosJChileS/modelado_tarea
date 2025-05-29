const pool = require('../db');
const isValidId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

exports.getEtiquetas = async (req, res) => {
  try {
    const q = await pool.query('SELECT * FROM etiquetas ORDER BY prioridad');
    res.json(q.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener etiquetas' });
  }
};

exports.createEtiqueta = async (req, res) => {
  const { nombre, color, prioridad } = req.body;
  if (!nombre || !color || typeof prioridad !== 'number')
    return res.status(400).json({ error: 'Datos incompletos' });

  try {
    const q = await pool.query(
      'INSERT INTO etiquetas (nombre, color, prioridad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, color, prioridad]
    );
    res.json(q.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear etiqueta' });
  }
};
