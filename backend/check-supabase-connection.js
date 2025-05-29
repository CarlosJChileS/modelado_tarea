require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ ¡Conexión exitosa a Supabase!');
    const res = await client.query('SELECT NOW() AS fecha_actual');
    console.log('Fecha/hora desde Supabase:', res.rows[0].fecha_actual);
  } catch (err) {
    console.error('❌ Error al conectar a Supabase:', err);
  } finally {
    await client.end();
  }
})();
