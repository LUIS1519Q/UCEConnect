const CreateIncident = require('../../../application/incidents/CreateIncident');
const ListIncidents = require('../../../application/incidents/ListIncidents');
const GetIncidentById = require('../../../application/incidents/GetIncidentById');
const UpdateStatus = require('../../../application/incidents/UpdateStatus');
const UpdateIncident = require('../../../application/incidents/UpdateIncident');
const CancelIncident = require('../../../application/incidents/CancelIncident');
const ClassifyIncident = require('../../../application/incidents/ClassifyIncident');
const DetectDuplicates = require('../../../application/incidents/DetectDuplicates');
const GetObservations = require('../../../application/incidents/GetObservations');
const GetSimilarIncident = require('../../../application/incidents/GetSimilarIncident');
const PostgresIncidentRepo = require('../../repositories/PostgresIncidentRepo');
const PostgresObservationRepo = require('../../repositories/PostgresObservationRepo');
const PostgresNotificationRepo = require('../../repositories/PostgresNotificationRepo');
const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const NotificationService = require('../../services/NotificationService');
const GeminiClassifier = require('../../services/GeminiClassifier');
const db = require('../../db/connection');
const logger = require('../../logger/logger');
const { io } = require('../server');

const incidentRepo = new PostgresIncidentRepo(db);
const observationRepo = new PostgresObservationRepo(db);
const notificationRepo = new PostgresNotificationRepo(db);
const notificationService = new NotificationService(io, notificationRepo, logger);
const userRepo = new PostgresUserRepo(db);
const classifier = new GeminiClassifier(process.env.OPENROUTER_API_KEY);
const classifyIncidentUC = new ClassifyIncident(classifier, logger);
const detectDuplicatesUC = new DetectDuplicates(incidentRepo, logger);

const mapIncidentError = (err, res, logger, context) => {
  logger.warn(`Error en ${context}: ${err.message}`);
  if (err.message.includes('not found') || err.message.includes('no encontrada'))
    return res.status(404).json({ message: err.message, errorCode: 'INCIDENT_NOT_FOUND' });
  if (err.message.includes('permission') || err.message.includes('permiso'))
    return res.status(403).json({ message: err.message, errorCode: 'INSUFFICIENT_PERMISSION' });
  if (err.message.includes('open') || err.message.includes('Transición'))
    return res.status(400).json({ message: err.message, errorCode: 'BUSINESS_RULE_VIOLATION' });
  return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
};

async function create(req, res) {
  try {
    const { title, description } = req.body;
    const incident = await new CreateIncident(
      incidentRepo,
      classifyIncidentUC,
      detectDuplicatesUC,
      logger,
      notificationService,
      userRepo
    ).execute({
      title,
      description,
      createdBy: req.user.id,
    });
    return res.status(201).json({ message: 'Incident created successfully.', incident });
  } catch (err) {
    logger.error(`Error al crear incidencia: ${err.message}`);
    return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
  }
}

async function list(req, res) {
  try {
    const result = await new ListIncidents(incidentRepo).execute({
      role: req.user.role,
      userId: req.user.id,
      status: req.query.status,
      categoryId: req.query.category_id,
      page: req.query.page,
      limit: req.query.limit,
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Error al listar incidencias: ${err.message}`);
    return res.status(500).json({ message: err.message, errorCode: 'INTERNAL_ERROR' });
  }
}

async function getById(req, res) {
  try {
    const result = await new GetIncidentById(incidentRepo).execute({
      id: Number(req.params.id),
      role: req.user.role,
      userId: req.user.id,
    });
    return res.status(200).json(result);
  } catch (err) {
    return mapIncidentError(err, res, logger, 'getById');
  }
}

async function updateStatus(req, res) {
  try {
    const incident = await new UpdateStatus(incidentRepo, logger, notificationService).execute({
      id: Number(req.params.id),
      newStatus: req.body.status,
      changedBy: req.user.id,
      note: req.body.note,
    });

    if (['resolved', 'rejected', 'cancelled'].includes(incident.status)) {
      io.to(`incident_${incident.id}`).emit('conversationLocked', {
        event: 'conversationLocked',
        status: incident.status,
        message: 'This conversation is now read-only.',
      });
    }

    return res.status(200).json({ message: 'Estado actualizado exitosamente', incident });
  } catch (err) {
    logger.warn(`Error al actualizar estado de incidencia ${req.params.id}: ${err.message}`);
    if (err.message.includes('no encontrada')) return res.status(404).json({ message: err.message, errorCode: 'INCIDENT_NOT_FOUND' });
    if (err.message.includes('Transición inválida')) return res.status(400).json({ message: err.message, errorCode: 'INVALID_TRANSITION' });
    return res.status(500).json({ message: err.message, errorCode: 'INTERNAL_ERROR' });
  }
}

async function update(req, res) {
  try {
    const incident = await new UpdateIncident(incidentRepo).execute({
      id: Number(req.params.id),
      title: req.body.title,
      description: req.body.description,
      categoryId: req.body.categoryId,
      userId: req.user.id,
    });
    return res.status(200).json({ message: 'Incidencia actualizada exitosamente', incident });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'update');
  }
}

async function cancel(req, res) {
  try {
    const incident = await new CancelIncident(incidentRepo).execute({
      id: Number(req.params.id),
      userId: req.user.id,
    });
    return res.status(200).json({ message: 'Incident cancelled successfully.', incident });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'cancel');
  }
}

async function getObservations(req, res) {
  try {
    const useCase = new GetObservations(incidentRepo, observationRepo, logger);
    const observations = await useCase.execute({
      incidentId: Number(req.params.id),
      role: req.user.role,
      userId: req.user.id,
    });
    return res.status(200).json({ observations });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'getObservations');
  }
}

async function getSimilarIncident(req, res) {
  try {
    const useCase = new GetSimilarIncident(incidentRepo, logger);
    const result = await useCase.execute({
      id: Number(req.params.id),
      userId: req.user.id,
      role: req.user.role,
    });
    return res.status(200).json({ incident: result });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'getSimilarIncident');
  }
}

module.exports = { create, list, getById, updateStatus, update, cancel, getObservations, getSimilarIncident };
