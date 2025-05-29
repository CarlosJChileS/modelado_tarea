--Queda como referencia para la creación de tablas y relaciones en la base de datos
-- Base de datos para la aplicación de gestión de tareas

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  pass VARCHAR(100) NOT NULL
);

-- Materias (cada usuario puede tener varias)
CREATE TABLE IF NOT EXISTS materias (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL
);

-- Etiquetas (prioridad, color, etc)
CREATE TABLE IF NOT EXISTS etiquetas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  color VARCHAR(20) NOT NULL, -- Ej: '#ff0000'
  prioridad INTEGER           -- Ej: 1=alta, 2=media, 3=baja
);

-- Tareas (con referencias a usuario y materia)
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  materia_id INTEGER REFERENCES materias(id) ON DELETE SET NULL,
  texto VARCHAR(255) NOT NULL,
  completada BOOLEAN DEFAULT false,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación N:M entre tareas y etiquetas
CREATE TABLE IF NOT EXISTS tareas_etiquetas (
  tarea_id INTEGER REFERENCES tareas(id) ON DELETE CASCADE,
  etiqueta_id INTEGER REFERENCES etiquetas(id) ON DELETE CASCADE,
  PRIMARY KEY (tarea_id, etiqueta_id)
);
