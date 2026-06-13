const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../logger/logger');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'uceconnect-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/incidents', require('./routes/incidentRoutes'));

app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    method: req.method,
    path: req.originalUrl,
  });
});

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
