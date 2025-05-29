const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware para permitir CORS (necesario si tu frontend está en otro dominio)
app.use(cors());

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// --------- Rutas de la API ---------
app.use('/api', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// --------- Ruta raíz para verificación ---------
app.get('/', (req, res) => {
  res.send('¡El backend está funcionando en Azure y en local! 🚀');
});

// --------- Servir archivos estáticos (opcional) ---------
// Si quieres servir tu frontend desde Express, descomenta esto
// app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
