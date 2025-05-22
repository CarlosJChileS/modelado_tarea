const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost', // Usa 'db' si tu backend corre en Docker junto con Postgres
  port: 5432,
  user: 'tareas_user',
  password: 'tareas_password',
  database: 'tareasdb'
});

module.exports = pool;
