const GetDashboardMetrics = require('../../../application/incidents/GetDashboardMetrics');
const PostgresIncidentRepo = require('../../repositories/PostgresIncidentRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const incidentRepo = new PostgresIncidentRepo(db);

async function getMetrics(req, res) {
  try {
    const result = await new GetDashboardMetrics(incidentRepo, logger).execute({ days: req.query.days });
    return res.status(200).json(result);
  } catch (err) {
    logger.error(`Error in getMetrics: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { getMetrics };
