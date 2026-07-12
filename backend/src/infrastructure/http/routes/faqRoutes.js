const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const faqController = require('../controllers/faqController');

const router = Router();

const createFaqSchema = z.object({
  question: z.string().min(5, 'Question must contain at least 5 characters.').max(500),
  answer: z.string().min(5, 'Answer must contain at least 5 characters.').max(2000),
  order: z.number().int().min(0).optional(),
});

const updateFaqSchema = z
  .object({
    question: z.string().min(5).max(500).optional(),
    answer: z.string().min(5).max(2000).optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((data) => data.question !== undefined || data.answer !== undefined || data.order !== undefined, {
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

router.post('/', authMiddleware, roleMiddleware('admin'), validate(createFaqSchema), faqController.create);

router.patch('/:id', authMiddleware, roleMiddleware('admin'), validate(updateFaqSchema), faqController.update);

router.delete('/:id', authMiddleware, roleMiddleware('admin'), faqController.remove);

module.exports = router;
