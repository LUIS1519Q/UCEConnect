// connection.js — Adaptador de infraestructura para PostgreSQL
// Expone un pool de conexiones reutilizable y helpers para consultas y transacciones.
// Este módulo pertenece a la capa de infraestructura: el dominio nunca lo importa directamente.

const { Pool } = require('pg');

// El pool gestiona y reutiliza conexiones en lugar de abrir una por cada consulta
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida correctamente');
});

pool.on('error', (error) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', error);
  process.exit(1);
});

/**
 * Ejecuta una consulta SQL usando una conexión del pool.
 * @param {string} text - Sentencia SQL parametrizada (usar $1, $2, ... para evitar inyección SQL)
 * @param {Array} params - Valores para los parámetros de la consulta
 * @returns {Promise<import('pg').QueryResult>}
 */
function query(text, params) {
  return pool.query(text, params);
}

/**
 * Obtiene un cliente dedicado del pool para ejecutar transacciones (BEGIN/COMMIT/ROLLBACK).
 * Importante: el cliente debe liberarse manualmente con client.release() al terminar.
 * @returns {Promise<import('pg').PoolClient>}
 */
function getClient() {
  return pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
};
