const bcrypt = require('bcrypt');
const pool = require('../db');

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  const { nombre, apellido, email, pass } = req.body;
  if (!nombre || !apellido || !email || !pass)
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });

  if (!isEmailValid(email))
    return res.status(400).json({ error: 'Correo electrónico no válido' });

  if (pass.length < 8)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });

  if (nombre.length > 50 || apellido.length > 50 || email.length > 100)
    return res.status(400).json({ error: 'Uno o más campos exceden la longitud permitida' });

  const hashedPassword = await bcrypt.hash(pass, 10);

  try {
    const check = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (check.rows.length > 0)
      return res.status(400).json({ error: 'Email ya registrado' });

    const insert = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, pass) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email',
      [nombre.trim(), apellido.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    res.json({ user: insert.rows[0] });
  } catch (err) {
    console.error("Error en /register:", err); // MOSTRAR EL ERROR REAL
    res.status(500).json({ error: 'Error en el registro' });
  }
};

exports.login = async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass)
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

  if (!isEmailValid(email))
    return res.status(400).json({ error: 'Correo electrónico inválido' });

  if (email.length > 100 || pass.length > 100)
    return res.status(400).json({ error: 'Email o contraseña demasiado largos' });

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, pass FROM usuarios WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(pass, user.pass);
    if (!validPassword)
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });

    delete user.pass;
    res.json({ user });
  } catch (err) {
    console.error("Error en /login:", err); // MOSTRAR EL ERROR REAL
    res.status(500).json({ error: 'Error en el login' });
  }
};
