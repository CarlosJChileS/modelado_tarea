# Imagen base de Node.js (Alpine es más liviana)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias primero (aprovecha cache)
COPY backend/package*.json ./

# Instala dependencias de producción
RUN npm ci --omit=dev

# Copia TODO el backend (incluyendo el frontend adentro)
COPY backend/ ./

# Expone el puerto 4000 (el que usa tu app)
EXPOSE 4000

# Comando para correr la app
CMD ["node", "server.js"]
