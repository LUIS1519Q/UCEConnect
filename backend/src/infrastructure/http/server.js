const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('../logger/logger');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:5173');
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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

const { initChat } = require('../sockets/chatHandler');
const db = require('../db/connection');
const PostgresIncidentRepo = require('../repositories/PostgresIncidentRepo');
const PostgresObservationRepo = require('../repositories/PostgresObservationRepo');
const jwt = require('jsonwebtoken');

const incidentRepo = new PostgresIncidentRepo(db);
const observationRepo = new PostgresObservationRepo(db);

initChat(io, {
  incidentRepo,
  observationRepo,
  logger,
  jwt,
  JWT_SECRET: process.env.JWT_SECRET,
});

module.exports = { app, httpServer };
