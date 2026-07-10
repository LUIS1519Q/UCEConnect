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
const FindSimilarIncidents = require('../../../application/incidents/FindSimilarIncidents');
const UploadAttachments = require('../../../application/incidents/UploadAttachments');
const buildAttachmentPolicy = require('../../../application/incidents/buildAttachmentPolicy');
const CorrectCategory = require('../../../application/incidents/CorrectCategory');
const AddInternalNote = require('../../../application/incidents/AddInternalNote');
const PostgresIncidentRepo = require('../../repositories/PostgresIncidentRepo');
const PostgresObservationRepo = require('../../repositories/PostgresObservationRepo');
const PostgresNotificationRepo = require('../../repositories/PostgresNotificationRepo');
const PostgresUserRepo = require('../../repositories/PostgresUserRepo');
const PostgresAttachmentRepo = require('../../repositories/PostgresAttachmentRepo');
const PostgresInternalNoteRepo = require('../../repositories/PostgresInternalNoteRepo');
const PostgresCategoryRepo = require('../../repositories/PostgresCategoryRepo');
const PostgresSettingsRepo = require('../../repositories/PostgresSettingsRepo');
const NotificationService = require('../../services/NotificationService');
const GeminiClassifier = require('../../services/GeminiClassifier');
const cloudinaryService = require('../../services/CloudinaryService');
const db = require('../../db/connection');
const logger = require('../../logger/logger');
const { io } = require('../server');

const incidentRepo = new PostgresIncidentRepo(db);
const observationRepo = new PostgresObservationRepo(db);
const notificationRepo = new PostgresNotificationRepo(db);
const notificationService = new NotificationService(io, notificationRepo, logger);
const userRepo = new PostgresUserRepo(db);
const attachmentRepo = new PostgresAttachmentRepo(db);
const internalNoteRepo = new PostgresInternalNoteRepo(db);
const categoryRepo = new PostgresCategoryRepo(db);
const settingsRepo = new PostgresSettingsRepo(db);
const classifier = new GeminiClassifier(process.env.OPENROUTER_API_KEY);
const classifyIncidentUC = new ClassifyIncident(classifier, logger, categoryRepo);
const detectDuplicatesUC = new DetectDuplicates(incidentRepo, logger);

const mapIncidentError = (err, res, logger, context) => {
  logger.warn(`Error en ${context}: ${err.message}`);
  if (err.message.includes('not found') || err.message.includes('no encontrada'))
    return res.status(404).json({ message: err.message, errorCode: 'INCIDENT_NOT_FOUND' });
  if (err.message.includes('permission') || err.message.includes('permiso'))
    return res.status(403).json({ message: err.message, errorCode: 'INSUFFICIENT_PERMISSION' });
  if (err.message.includes('open') || err.message.includes('Transición'))
    return res.status(400).json({ message: err.message, errorCode: 'BUSINESS_RULE_VIOLATION' });
  if (err.message.includes('no permitido') || err.message.includes('excede') || err.message.includes('no existe'))
    return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
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
    const result = await new GetIncidentById(incidentRepo, attachmentRepo, internalNoteRepo).execute({
      id: Number(req.params.id),
      role: req.user.role,
      userId: req.user.id,
    });
    return res.status(200).json(result);
  } catch (err) {
    return mapIncidentError(err, res, logger, 'getById');
  }
}

async function correctCategory(req, res) {
  try {
    const incident = await new CorrectCategory(incidentRepo, logger).execute({
      id: Number(req.params.id),
      categoryId: req.body.categoryId,
    });
    return res.status(200).json({ message: 'Categoría corregida exitosamente', incident });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'correctCategory');
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

async function findSimilar(req, res) {
  try {
    const results = await new FindSimilarIncidents(incidentRepo, logger).execute({
      title: req.body.title,
      description: req.body.description,
    });
    return res.status(200).json({ data: results });
  } catch (err) {
    logger.error(`Error en findSimilar: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function uploadAttachments(req, res) {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'Se requiere al menos un archivo.', errorCode: 'VALIDATION_ERROR' });

    const settings = await settingsRepo.findSettings();
    const dynamicPolicy = buildAttachmentPolicy(settings);

    const attachments = await new UploadAttachments(
      incidentRepo,
      attachmentRepo,
      cloudinaryService,
      dynamicPolicy,
      logger
    ).execute({
      incidentId: Number(req.params.id),
      userId: req.user.id,
      role: req.user.role,
      files: req.files.map((f) => ({
        buffer: f.buffer,
        mimetype: f.mimetype,
        originalname: f.originalname,
        size: f.size,
      })),
    });

    return res.status(201).json({ message: 'Archivos adjuntados exitosamente.', attachments });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'uploadAttachments');
  }
}

async function addInternalNote(req, res) {
  try {
    const note = await new AddInternalNote(incidentRepo, internalNoteRepo, logger).execute({
      incidentId: Number(req.params.id),
      authorId: req.user.id,
      authorName: req.user.name || req.user.email,
      authorRole: req.user.role,
      message: req.body.message,
    });
    return res.status(201).json({ message: 'Nota interna agregada exitosamente', note });
  } catch (err) {
    return mapIncidentError(err, res, logger, 'addInternalNote');
  }
}

module.exports = {
  create,
  list,
  getById,
  updateStatus,
  update,
  cancel,
  getObservations,
  getSimilarIncident,
  findSimilar,
  uploadAttachments,
  correctCategory,
  addInternalNote,
};
