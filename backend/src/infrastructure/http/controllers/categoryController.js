const CreateCategory = require('../../../application/categories/CreateCategory');
const UpdateCategory = require('../../../application/categories/UpdateCategory');
const ListCategories = require('../../../application/categories/ListCategories');
const PostgresCategoryRepo = require('../../repositories/PostgresCategoryRepo');
const db = require('../../db/connection');
const logger = require('../../logger/logger');

const categoryRepo = new PostgresCategoryRepo(db);

async function create(req, res) {
  try {
    const category = await new CreateCategory(categoryRepo, logger).execute({
      name: req.body.name,
      description: req.body.description,
    });
    return res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    logger.warn(`Error in createCategory: ${err.message}`);
    if (err.message.includes('already exists'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function list(req, res) {
  try {
    const categories = await new ListCategories(categoryRepo, logger).execute({
      isActive: req.query.isActive,
    });
    return res.status(200).json({ data: categories });
  } catch (err) {
    logger.error(`Error in listCategories: ${err.message}`);
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

async function update(req, res) {
  try {
    const category = await new UpdateCategory(categoryRepo, logger).execute({
      id: Number(req.params.id),
      name: req.body.name,
      description: req.body.description,
      isActive: req.body.isActive,
    });
    return res.status(200).json({ message: 'Category updated successfully', category });
  } catch (err) {
    logger.warn(`Error in updateCategory: ${err.message}`);
    if (err.message.includes('not found'))
      return res.status(404).json({ message: err.message, errorCode: 'CATEGORY_NOT_FOUND' });
    if (err.message.includes('already exists'))
      return res.status(400).json({ message: err.message, errorCode: 'VALIDATION_ERROR' });
    return res.status(500).json({ message: 'Internal server error.', errorCode: 'INTERNAL_ERROR' });
  }
}

module.exports = { create, list, update };
