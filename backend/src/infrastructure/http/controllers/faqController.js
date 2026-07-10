const CreateFaqItem = require('../../../application/settings/CreateFaqItem');
const UpdateFaqItem = require('../../../application/settings/UpdateFaqItem');
const DeleteFaqItem = require('../../../application/settings/DeleteFaqItem');
const PostgresHelpItemRepo = require('../../repositories/PostgresHelpItemRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const helpItemRepo = new PostgresHelpItemRepo(db);

async function create(req, res) {
  try {
    const item = await new CreateFaqItem(helpItemRepo, logger).execute({
      question: req.body.question,
      answer: req.body.answer,
      order: req.body.order,
    });
    return res.status(201).json({ message: 'Pregunta frecuente creada exitosamente', item });
  } catch (err) {
    logger.warn(`Error en createFaqItem: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function update(req, res) {
  try {
    const item = await new UpdateFaqItem(helpItemRepo, logger).execute({
      id: Number(req.params.id),
      question: req.body.question,
      answer: req.body.answer,
      order: req.body.order,
    });
    return res.status(200).json({ message: 'Pregunta frecuente actualizada exitosamente', item });
  } catch (err) {
    logger.warn(`Error en updateFaqItem: ${err.message}`);
    if (err.message.includes('no encontrada'))
      return res.status(404).json({ message: err.message, errorCode: 'FAQ_ITEM_NOT_FOUND' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function remove(req, res) {
  try {
    const result = await new DeleteFaqItem(helpItemRepo, logger).execute({ id: Number(req.params.id) });
    return res.status(200).json(result);
  } catch (err) {
    logger.warn(`Error en deleteFaqItem: ${err.message}`);
    if (err.message.includes('no encontrada'))
      return res.status(404).json({ message: err.message, errorCode: 'FAQ_ITEM_NOT_FOUND' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { create, update, remove };
