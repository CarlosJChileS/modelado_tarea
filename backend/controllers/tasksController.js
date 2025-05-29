const pool = require('../db');

const isValidId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

// Obtener tareas (con materia y etiquetas)
exports.getTasks = async (req, res) => {
  const { userId } = req.query;

  if (!isValidId(userId)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  try {
    const q = await pool.query(
      `
      SELECT t.*, m.nombre as materia,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', e.id, 'nombre', e.nombre, 'color', e.color, 'prioridad', e.prioridad)
          ) FILTER (WHERE e.id IS NOT NULL), '[]'
        ) as etiquetas
      FROM tareas t
      LEFT JOIN materias m ON t.materia_id = m.id
      LEFT JOIN tareas_etiquetas te ON t.id = te.tarea_id
      LEFT JOIN etiquetas e ON te.etiqueta_id = e.id
      WHERE t.usuario_id = $1
      GROUP BY t.id, m.nombre
      ORDER BY t.fecha DESC
      `,
      [userId]
    );
    res.json(q.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

// Crear tarea (puede incluir materia y etiquetas)
exports.createTask = async (req, res) => {
  const { userId, text, materiaId, etiquetas } = req.body;

  if (!isValidId(userId))
    return res.status(400).json({ error: 'ID de usuario inválido' });

  if (!text || typeof text !== 'string' || text.trim().length === 0)
    return res.status(400).json({ error: 'Texto de tarea inválido' });

  try {
    const tareaInsert = await pool.query(
      'INSERT INTO tareas (usuario_id, texto, materia_id) VALUES ($1, $2, $3) RETURNING *',
      [userId, text.trim(), materiaId || null]
    );
    const tarea = tareaInsert.rows[0];

    // Si recibes etiquetas (array de ids), las asocias
    if (Array.isArray(etiquetas) && etiquetas.length > 0) {
      const values = etiquetas.map((etiquetaId, i) => `($1, $${i + 2})`).join(',');
      await pool.query(
        `INSERT INTO tareas_etiquetas (tarea_id, etiqueta_id) VALUES ${values}`,
        [tarea.id, ...etiquetas]
      );
    }

    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
};

// Cambiar estado de completada
exports.toggleTask = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (!isValidId(userId) || !isValidId(id))
    return res.status(400).json({ error: 'ID inválido' });

  try {
    const q = await pool.query(
      `UPDATE tareas SET completada = NOT completada WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json(q.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

// Eliminar tarea (borra relaciones de etiquetas por ON DELETE CASCADE)
exports.deleteTask = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (!isValidId(userId) || !isValidId(id))
    return res.status(400).json({ error: 'ID inválido' });

  try {
    const q = await pool.query(
      `DELETE FROM tareas WHERE id = $1 AND usuario_id = $2 RETURNING *`,
      [id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

// Editar tarea (texto, materia, etiquetas)
exports.editTask = async (req, res) => {
  const { userId, text, materiaId, etiquetas } = req.body;
  const { id } = req.params;

  if (!isValidId(userId) || !isValidId(id))
    return res.status(400).json({ error: 'ID inválido' });

  if (!text || typeof text !== 'string' || text.trim().length === 0)
    return res.status(400).json({ error: 'Texto de tarea inválido' });

  try {
    // Actualiza texto y materia
    const q = await pool.query(
      `UPDATE tareas SET texto = $1, materia_id = $2 WHERE id = $3 AND usuario_id = $4 RETURNING *`,
      [text.trim(), materiaId || null, id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });

    // Actualiza etiquetas si recibes array
    if (Array.isArray(etiquetas)) {
      // Borra relaciones antiguas
      await pool.query('DELETE FROM tareas_etiquetas WHERE tarea_id = $1', [id]);
      // Agrega las nuevas
      if (etiquetas.length > 0) {
        const values = etiquetas.map((etiquetaId, i) => `($1, $${i + 2})`).join(',');
        await pool.query(
          `INSERT INTO tareas_etiquetas (tarea_id, etiqueta_id) VALUES ${values}`,
          [id, ...etiquetas]
        );
      }
    }

    res.json(q.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al editar tarea' });
  }
};
