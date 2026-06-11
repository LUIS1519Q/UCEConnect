// index.js — Punto de entrada de la aplicación UCEConnect Backend
// Carga la configuración, verifica la conexión a la base de datos y levanta el servidor HTTP.

require('dotenv').config();

const app = require('./infrastructure/http/server');
const { pool } = require('./infrastructure/db/connection');
const logger = require('./infrastructure/logger/logger');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verificamos la conexión a la base de datos antes de aceptar tráfico HTTP
    await pool.query('SELECT NOW()');
    logger.info('✅ Base de datos conectada');

    app.listen(PORT, () => {
      logger.info(`🚀 UCEConnect Backend | Puerto: ${PORT} | Entorno: ${process.env.NODE_ENV || 'development'} | Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error(`❌ No se pudo conectar a la base de datos: ${error.message}`);
    process.exit(1);
  }
}

startServer();
