const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necesario para Supabase desde Azure
  }
});

module.exports = pool;
// Este archivo configura la conexión a la base de datos PostgreSQL usando pg.
// Asegúrate de que la variable de entorno DATABASE_URL esté configurada correctamente en tu entorno de producción.