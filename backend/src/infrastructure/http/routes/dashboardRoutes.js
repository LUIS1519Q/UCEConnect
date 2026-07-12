const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const dashboardController = require('../controllers/dashboardController');

const router = Router();

const dashboardQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(30),
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
  '/',
  authMiddleware,
  roleMiddleware('manager', 'admin'),
  validateQuery(dashboardQuerySchema),
  dashboardController.getMetrics
);

module.exports = router;
