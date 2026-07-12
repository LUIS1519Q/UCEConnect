const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const reportController = require('../controllers/reportController');

const router = Router();

const monthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'month must be in YYYY-MM format.').optional(),
});

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

router.get(
  '/monthly',
  authMiddleware,
  roleMiddleware('admin'),
  validateQuery(monthQuerySchema),
  reportController.getMonthlySummary
);

router.get(
  '/monthly/pdf',
  authMiddleware,
  roleMiddleware('admin'),
  validateQuery(monthQuerySchema),
  reportController.downloadPdf
);

router.get(
  '/monthly/excel',
  authMiddleware,
  roleMiddleware('admin'),
  validateQuery(monthQuerySchema),
  reportController.downloadExcel
);

module.exports = router;
