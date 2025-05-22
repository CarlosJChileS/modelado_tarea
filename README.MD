# 📝 TaskMate – Proyecto de Lista de Tareas

Aplicación web de tareas con **JavaScript (frontend)** y **Node.js/Express + PostgreSQL (backend y base de datos)** usando **Docker Compose** para facilitar la instalación.

---

## 🚀 Requisitos previos

- Node.js (para el backend)
- Docker Desktop (para la base de datos)
- Git (opcional)

---

## ⚡️ Pasos para ejecutar el proyecto

1. **Clona el repositorio o copia los archivos:**
   ```bash
   git clone https://github.com/tu-usuario/modelado_tarea.git
   cd modelado_tarea
## 2 Levanta la base de datos con Docker:
docker-compose up -d
## 3 Configura y corre el backend:
cd backend
npm install
node server.js
El servidor Express inicia en http://localhost:4000.
Usa estas variables de conexión en el backend:

Host: localhost

Puerto: 5432

Usuario: tareas_user

Contraseña: tareas_password

Base de datos: tareasdb

Abre el frontend:

Abre el archivo index.html en tu navegador.

