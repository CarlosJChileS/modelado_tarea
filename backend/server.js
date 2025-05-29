const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware para permitir CORS (solo necesario si el frontend está en otro dominio)
app.use(cors());

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// --------- Rutas de la API ---------
app.use('/api', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// --------- Servir archivos estáticos del frontend ---------
app.use(express.static(path.join(__dirname, '..', 'frontend')));
// --------- Ruta raíz para servir index.html del frontend ---------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// --------- (Opcional) Catch-all para SPA (React/Vue/Angular) ---------
// Si tu frontend es SPA y usas rutas del lado del cliente, descomenta este bloque:
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
