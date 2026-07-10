const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const incidentController = require('../controllers/incidentController');
const { uploadAttachments } = require('../middlewares/uploadMiddleware');

const router = Router();

const createIncidentSchema = z.object({
  title: z.string()
    .min(5, 'Title must contain between 5 and 200 characters.')
    .max(200, 'Title must contain between 5 and 200 characters.'),
  description: z.string()
    .min(10, 'Description must contain between 10 and 5000 characters.')
    .max(5000, 'Description must contain between 10 and 5000 characters.'),
});

const listIncidentsSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'rejected', 'cancelled']).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

const updateStatusSchema = z.object({
  status: z.enum(['in_progress', 'resolved', 'rejected']),
  note: z.string().min(1, 'La justificación es obligatoria.').max(500, 'La justificación no puede superar los 500 caracteres.'),
});

const updateIncidentSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.number().int().positive().optional(),
});

const similarPreviewSchema = z.object({
  title: z.string()
    .min(5, 'Title must contain between 5 and 200 characters.')
    .max(200, 'Title must contain between 5 and 200 characters.'),
  description: z.string().max(5000, 'Description must contain at most 5000 characters.').optional(),
});

const correctCategorySchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

const addInternalNoteSchema = z.object({
  message: z.string()
    .min(1, 'El mensaje no puede estar vacío.')
    .max(1000, 'El mensaje no puede superar los 1000 caracteres.'),
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

router.get('/', authMiddleware, validateQuery(listIncidentsSchema), incidentController.list);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('student'),
  validate(createIncidentSchema),
  incidentController.create
);

router.get('/:id', authMiddleware, incidentController.getById);

router.get('/:id/observations', authMiddleware, incidentController.getObservations);

router.get('/:id/similar', authMiddleware, incidentController.getSimilarIncident);

router.post(
  '/similar',
  authMiddleware,
  roleMiddleware('student'),
  validate(similarPreviewSchema),
  incidentController.findSimilar
);

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

router.post(
  '/:id/attachments',
  authMiddleware,
  roleMiddleware('student', 'manager', 'admin'),
  uploadAttachments,
  incidentController.uploadAttachments
);

router.patch(
  '/:id/category',
  authMiddleware,
  roleMiddleware('manager', 'admin'),
  validate(correctCategorySchema),
  incidentController.correctCategory
);

router.post(
  '/:id/internal-notes',
  authMiddleware,
  roleMiddleware('manager', 'admin'),
  validate(addInternalNoteSchema),
  incidentController.addInternalNote
);

module.exports = router;
