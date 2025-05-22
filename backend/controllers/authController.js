const pool = require('../db');

exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
  const { email, pass } = req.body;
  try {
    const q = await pool.query(
      'SELECT id, nombre, apellido, email FROM usuarios WHERE email=$1 AND pass=$2',
      [email, pass]
    );
    if (q.rows.length === 0)
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    res.json({ user: q.rows[0] });
  } catch {
    res.status(500).json({ error: 'Error en el login' });
  }
};
