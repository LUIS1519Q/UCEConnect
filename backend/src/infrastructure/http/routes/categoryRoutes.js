const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const categoryController = require('../controllers/categoryController');

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters.').max(100, 'Name must contain at most 100 characters.'),
  description: z.string().max(500, 'Description must contain at most 500 characters.').optional(),
});

const listCategoriesSchema = z.object({
  isActive: z.coerce.boolean().optional(),
});

const updateCategorySchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined || data.isActive !== undefined, {
    message: 'You must send at least one field to update.',
  });

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.query = result.data;
    next();
  };
}

router.get('/', authMiddleware, validateQuery(listCategoriesSchema), categoryController.list);

router.post('/', authMiddleware, roleMiddleware('admin'), validate(createCategorySchema), categoryController.create);

router.patch('/:id', authMiddleware, roleMiddleware('admin'), validate(updateCategorySchema), categoryController.update);

module.exports = router;
