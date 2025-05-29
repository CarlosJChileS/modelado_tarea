const pool = require('../db');
const isValidId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

exports.getMaterias = async (req, res) => {
  const { userId } = req.query;
  if (!isValidId(userId))
    return res.status(400).json({ error: 'ID de usuario inválido' });

  try {
    const q = await pool.query(
      'SELECT * FROM materias WHERE usuario_id = $1 ORDER BY nombre',
      [userId]
    );
    res.json(q.rows);
  } catch (err) {
    console.error("Error en /materias (get):", err); // MOSTRAR EL ERROR REAL
    res.status(500).json({ error: 'Error al obtener materias' });
  }
};

exports.createMateria = async (req, res) => {
  const { userId, nombre } = req.body;
  if (!isValidId(userId) || !nombre)
    return res.status(400).json({ error: 'Datos incompletos' });

  try {
    const q = await pool.query(
      'INSERT INTO materias (usuario_id, nombre) VALUES ($1, $2) RETURNING *',
      [userId, nombre]
    );
    res.json(q.rows[0]);
  } catch (err) {
    console.error("Error en /materias (create):", err); // MOSTRAR EL ERROR REAL
    res.status(500).json({ error: 'Error al crear materia' });
  }
};
