const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

const router = Router();

const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must contain at least 2 characters.')
    .max(50, 'First name must contain at most 50 characters.')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'First name must contain only letters and spaces.'),
  lastName: z
    .string()
    .min(2, 'Last name must contain at least 2 characters.')
    .max(50, 'Last name must contain at most 50 characters.')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Last name must contain only letters and spaces.'),
  email: z.string().email().refine((value) => value.endsWith('@uce.edu.ec'), {
    message: 'Only institutional emails are allowed (@uce.edu.ec).',
  }),
  role: z.enum(['student', 'manager', 'admin']),
});

const listUsersSchema = z.object({
  role: z.enum(['student', 'manager', 'admin']).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const manageUserSchema = z
  .object({
    role: z.enum(['student', 'manager', 'admin']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => data.role !== undefined || data.isActive !== undefined, {
    message: 'Debes enviar al menos role o isActive.',
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

router.post('/', authMiddleware, roleMiddleware('admin'), validate(createUserSchema), userController.createUser);

router.get('/', authMiddleware, roleMiddleware('admin'), validateQuery(listUsersSchema), userController.list);

router.patch(
  '/:id/manage',
  authMiddleware,
  roleMiddleware('admin'),
  validate(manageUserSchema),
  userController.manage
);

module.exports = router;
