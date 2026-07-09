const db = require('../../db/connection');
const logger = require('../../logger/logger');

async function getHelp(req, res) {
  try {
    const itemsResult = await db.query(
      'SELECT id, question, answer, "order" FROM help_items ORDER BY "order" ASC'
    );
    return res.status(200).json({
      pageTitle: 'Help & FAQ',
      pageDescription: 'Frequently asked questions about UCEConnect.',
      supportEmail: 'support@uceconnect.edu.ec',
      items: itemsResult.rows,
    });
  } catch (err) {
    logger.error(`Error en getHelp: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function getAbout(req, res) {
  try {
    const result = await db.query('SELECT * FROM about_info LIMIT 1');
    const info = result.rows[0] || {};
    return res.status(200).json({
      applicationName: info.application_name || null,
      version: info.version || null,
      description: info.description || null,
      institution: info.institution || null,
      contact: {
        email: info.contact_email || null,
        website: info.contact_website || null,
      },
      developedBy: info.developed_by || null,
      copyright: info.copyright || null,
    });
  } catch (err) {
    logger.error(`Error en getAbout: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { getHelp, getAbout };
