require('dotenv').config();

const app = require('./infrastructure/http/server');
const { pool } = require('./infrastructure/db/connection');
const logger = require('./infrastructure/logger/logger');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
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
