// server.js — Configuración de la aplicación Express (adaptador HTTP)
// Define middlewares globales, rutas y manejo de errores.
// La capa de dominio no se importa aquí directamente: las rutas delegan en application/.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../logger/logger');

const app = express();

// --- Middlewares de seguridad y utilidades ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check: usado por Docker y los servicios de despliegue ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'uceconnect-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- Rutas de la API ---
// Cada router se monta bajo su propio prefijo y delega en la capa de aplicación.
app.use('/api/v1/auth', require('./routes/authRoutes'));
// app.use('/api/v1/incidents', require('./routes/incidents.routes'));
// app.use('/api/v1/notifications', require('./routes/notifications.routes'));
// app.use('/api/v1/analytics', require('./routes/analytics.routes'));
// app.use('/api/v1/categories', require('./routes/categories.routes'));

// --- Manejo de rutas no encontradas ---
app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    method: req.method,
    path: req.originalUrl,
  });
});

// --- Manejador de errores global ---
// En producción se oculta el detalle del error para no exponer información sensible.
app.use((err, req, res, next) => {
  logger.error(`Error en ${req.method} ${req.path}: ${err.message}`, { stack: err.stack });

  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'Error interno del servidor' : err.message;

  res.status(err.status || 500).json({
    status: 'error',
    message,
  });
});

module.exports = app;
