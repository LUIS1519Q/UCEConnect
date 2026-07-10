const GetSettings = require('../../../application/settings/GetSettings');
const UpdateSettings = require('../../../application/settings/UpdateSettings');
const UploadLogo = require('../../../application/settings/UploadLogo');
const PostgresSettingsRepo = require('../../repositories/PostgresSettingsRepo');
const cloudinaryService = require('../../services/CloudinaryService');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const settingsRepo = new PostgresSettingsRepo(db);

async function getSettings(req, res) {
  try {
    const settings = await new GetSettings(settingsRepo, logger).execute();
    return res.status(200).json(settings);
  } catch (err) {
    logger.error(`Error en getSettings: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function updateSettings(req, res) {
  try {
    const settings = await new UpdateSettings(settingsRepo, logger).execute(req.body);
    return res.status(200).json({ message: 'Configuración actualizada exitosamente', settings });
  } catch (err) {
    logger.warn(`Error en updateSettings: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function uploadLogo(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'Logo file is required.', errorCode: 'VALIDATION_ERROR' });

    const result = await new UploadLogo(settingsRepo, cloudinaryService, logger).execute({
      fileBuffer: req.file.buffer,
    });

    return res.status(200).json({ message: 'Logo actualizado exitosamente', logoUrl: result.logoUrl });
  } catch (err) {
    logger.warn(`Error en uploadLogo: ${err.message}`);
    if (err.message.includes('required'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { getSettings, updateSettings, uploadLogo };
