const CreateIncident = require('../../../application/incidents/CreateIncident');
const ListIncidents = require('../../../application/incidents/ListIncidents');
const GetIncidentById = require('../../../application/incidents/GetIncidentById');
const UpdateStatus = require('../../../application/incidents/UpdateStatus');
const PostgresIncidentRepo = require('../../repositories/PostgresIncidentRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const incidentRepo = new PostgresIncidentRepo(db);

async function create(req, res) {
  try {
    const incident = await new CreateIncident(incidentRepo, logger).execute({
      ...req.body,
      createdBy: req.user.id,
    });
    return res.status(201).json({ message: 'Incidencia creada exitosamente', incident });
  } catch (err) {
    logger.error(`Error al crear incidencia: ${err.message}`);
    return res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const result = await new ListIncidents(incidentRepo).execute({
      role: req.user.role,
      userId: req.user.id,
      status: req.query.status,
      categoryId: req.query.category_id ? Number(req.query.category_id) : undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Error al listar incidencias: ${err.message}`);
    return res.status(500).json({ message: err.message });
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
    logger.warn(`Error al obtener incidencia ${req.params.id}: ${err.message}`);
    if (err.message.includes('no encontrada')) return res.status(404).json({ message: err.message });
    if (err.message.includes('permiso')) return res.status(403).json({ message: err.message });
    return res.status(500).json({ message: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const incident = await new UpdateStatus(incidentRepo, logger).execute({
      id: Number(req.params.id),
      newStatus: req.body.status,
      changedBy: req.user.id,
      note: req.body.note,
    });
    return res.status(200).json({ message: 'Estado actualizado exitosamente', incident });
  } catch (err) {
    logger.warn(`Error al actualizar estado de incidencia ${req.params.id}: ${err.message}`);
    if (err.message.includes('no encontrada')) return res.status(404).json({ message: err.message });
    if (err.message.includes('Transición inválida')) return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { create, list, getById, updateStatus };
