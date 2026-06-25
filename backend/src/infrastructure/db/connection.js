const { Pool } = require('pg');
const logger = require('../logger/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('❌ Error en PostgreSQL:', err);
  process.exit(1);
});

function query(text, params) {
  return pool.query(text, params);
}

function getClient() {
  return pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
};
