const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 4000;

// Cambia estas variables si usas otras credenciales en docker-compose
const pool = new Pool({
  host: 'localhost',         // o 'db' si tu backend corre en Docker junto con Postgres
  port: 5432,
  user: 'tareas_user',
  password: 'tareas_password',
  database: 'tareasdb'
});

app.use(cors());
app.use(express.json());

// --- Registro de usuario ---
app.post('/api/register', async (req, res) => {
  const { nombre, apellido, email, pass } = req.body;
  try {
    const check = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (check.rows.length > 0)
      return res.status(400).json({ error: 'Email ya registrado' });

    const insert = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, pass) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email',
      [nombre, apellido, email, pass]
    );
    res.json({ user: insert.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  const { email, pass } = req.body;
  try {
    const q = await pool.query('SELECT id, nombre, apellido, email FROM usuarios WHERE email=$1 AND pass=$2', [email, pass]);
    if (q.rows.length === 0)
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    res.json({ user: q.rows[0] });
  } catch {
    res.status(500).json({ error: 'Error en el login' });
  }
});

// --- Obtener tareas del usuario ---
app.get('/api/tasks', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Falta el id de usuario" });
  try {
    const q = await pool.query(
      'SELECT * FROM tareas WHERE usuario_id = $1 ORDER BY fecha DESC',
      [userId]
    );
    res.json(q.rows);
  } catch {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// --- Agregar tarea ---
app.post('/api/tasks', async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) return res.status(400).json({ error: "Faltan datos" });
  try {
    const q = await pool.query(
      'INSERT INTO tareas (usuario_id, texto) VALUES ($1, $2) RETURNING *',
      [userId, text]
    );
    res.json(q.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
});

// --- Completar o descompletar tarea ---
app.put('/api/tasks/:id', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    // Solo permite cambiar el estado si la tarea pertenece a ese usuario
    const q = await pool.query(
      `UPDATE tareas 
       SET completada = NOT completada
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, userId]
    );
    if (q.rows.length === 0)
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    res.json(q.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// --- (Opcional) Eliminar tarea ---
app.delete('/api/tasks/:id', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
    // Solo elimina si la tarea es del usuario autenticado
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
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
