const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const incidentController = require('../controllers/incidentController');

const router = Router();

const createSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  categoryId: z.number().int().positive(),
});

const updateStatusSchema = z.object({
  status: z.enum(['in_progress', 'resolved', 'rejected']),
  note: z.string().max(500).optional(),
});

const updateIncidentSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.number().int().positive().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Error de validación',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}

router.get('/', authMiddleware, incidentController.list);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('student'),
  validate(createSchema),
  incidentController.create
);

router.get('/:id', authMiddleware, incidentController.getById);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('student'),
  validate(updateIncidentSchema),
  incidentController.update
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  roleMiddleware('student'),
  incidentController.cancel
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('manager', 'admin'),
  validate(updateStatusSchema),
  incidentController.updateStatus
);

module.exports = router;
