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

module.exports = { app, httpServer, io };

const authMiddleware = require('./middlewares/authMiddleware');
const helpController = require('./controllers/helpController');
const authController = require('./controllers/authController');

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
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/categories', require('./routes/categoryRoutes'));
app.use('/api/v1/reports', require('./routes/reportRoutes'));
app.use('/api/v1/settings', require('./routes/settingsRoutes'));
app.use('/api/v1/faq', require('./routes/faqRoutes'));

app.get('/api/v1/help', authMiddleware, helpController.getHelp);
app.get('/api/v1/about', authMiddleware, helpController.getAbout);

app.get('/api/v1/faculties', authMiddleware, authController.getFacultiesHandler);
app.get('/api/v1/careers', authMiddleware, authController.getCareersHandler);

app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.path}: ${err.message}`, { stack: err.stack });

  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'Internal server error' : err.message;

  res.status(err.status || 500).json({
    status: 'error',
    message,
  });
});

const { initChat } = require('../sockets/chatHandler');
const db = require('../db/connection');
const PostgresIncidentRepo = require('../repositories/PostgresIncidentRepo');
const PostgresObservationRepo = require('../repositories/PostgresObservationRepo');
const PostgresNotificationRepo = require('../repositories/PostgresNotificationRepo');
const PostgresUserRepo = require('../repositories/PostgresUserRepo');
const NotificationService = require('../services/NotificationService');
const jwt = require('jsonwebtoken');

const incidentRepo = new PostgresIncidentRepo(db);
const observationRepo = new PostgresObservationRepo(db);
const notificationRepo = new PostgresNotificationRepo(db);
const userRepo = new PostgresUserRepo(db);
const notificationService = new NotificationService(io, notificationRepo, logger);

initChat(io, {
  incidentRepo,
  observationRepo,
  userRepo,
  logger,
  jwt,
  JWT_SECRET: process.env.JWT_SECRET,
  notificationService,
});
