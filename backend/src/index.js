// index.js — Punto de entrada de la aplicación UCEConnect Backend
// Carga la configuración, verifica la conexión a la base de datos y levanta el servidor HTTP.

require('dotenv').config();

const app = require('./infrastructure/http/server');
const { pool } = require('./infrastructure/db/connection');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Verificamos la conexión a la base de datos antes de aceptar tráfico HTTP
    await pool.query('SELECT NOW()');
    console.log('✅ Base de datos conectada');

    app.listen(PORT, () => {
      console.log('--------------------------------------------------');
      console.log('🚀 UCEConnect Backend');
      console.log(`   Puerto:   ${PORT}`);
      console.log(`   Entorno:  ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health:   http://localhost:${PORT}/health`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos. Deteniendo el servidor.', error);
    process.exit(1);
  }
}

startServer();
