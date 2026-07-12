const PostgresHelpItemRepo = require('../../repositories/PostgresHelpItemRepo');
const PostgresSettingsRepo = require('../../repositories/PostgresSettingsRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const helpItemRepo = new PostgresHelpItemRepo(db);
const settingsRepo = new PostgresSettingsRepo(db);

async function getHelp(req, res) {
  try {
    const [items, settings] = await Promise.all([helpItemRepo.findAll(), settingsRepo.findSettings()]);
    return res.status(200).json({
      pageTitle: 'Help & FAQ',
      pageDescription: 'Frequently asked questions about UCEConnect.',
      supportEmail: settings.contactEmail,
      items: items.map((item) => item.toJSON()),
    });
  } catch (err) {
    logger.error(`Error in getHelp: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function getAbout(req, res) {
  try {
    const settings = await settingsRepo.findSettings();
    return res.status(200).json({
      applicationName: settings.applicationName,
      version: settings.version,
      description: settings.description,
      institution: settings.institution,
      contact: {
        email: settings.contactEmail,
        website: settings.contactWebsite,
      },
      developedBy: settings.developedBy,
      copyright: settings.copyright,
      logoUrl: settings.logoUrl,
    });
  } catch (err) {
    logger.error(`Error in getAbout: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { getHelp, getAbout };
