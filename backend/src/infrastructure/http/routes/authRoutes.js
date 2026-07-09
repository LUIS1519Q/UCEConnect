const { Router } = require('express');
const { z } = require('zod');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = Router();

const registerSchema = z
  .object({
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
    password: z
      .string()
      .min(8)
      .regex(/\d/, 'Password must contain at least one number.'),
    confirmPassword: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const resendSchema = z.object({
  email: z.string().email(),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  resetToken: z.string().min(1, 'Reset token is required.'),
  newPassword: z
    .string()
    .min(8, 'Password must contain at least 8 characters.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
});

const verifyResetCodeSchema = z.object({
  email: z.string().email().endsWith('@uce.edu.ec'),
  code: z.string().length(6),
});

const resendResetCodeSchema = z.object({
  email: z.string().email().endsWith('@uce.edu.ec'),
});

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must contain between 2 and 50 characters.')
    .max(50, 'First name must contain between 2 and 50 characters.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'First name must contain only letters and spaces.')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must contain between 2 and 50 characters.')
    .max(50, 'Last name must contain between 2 and 50 characters.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Last name must contain only letters and spaces.')
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number format.')
    .optional(),
  facultyId: z.coerce.number().int().positive().optional(),
  careerId: z.coerce.number().int().positive().optional(),
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

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-code', validate(verifySchema), authController.verifyCode);
router.post('/login', validate(loginSchema), authController.login);
router.post('/resend-code', validate(resendSchema), authController.resendCode);
router.post('/forgot-password', validate(forgotSchema), authController.forgotPassword);
router.post('/verify-reset-code', validate(verifyResetCodeSchema), authController.verifyResetCodeHandler);
router.post('/resend-reset-code', validate(resendResetCodeSchema), authController.resendResetCodeHandler);
router.post('/reset-password', validate(resetSchema), authController.resetPassword);

router.get('/microsoft', authController.microsoftLogin);
router.get('/microsoft/callback', authController.microsoftCallback);

router.get('/me', authMiddleware, authController.getProfile);
router.patch('/me', authMiddleware, validate(updateProfileSchema), authController.updateProfileHandler);
router.patch('/me/avatar', authMiddleware, upload.single('avatar'), authController.updateAvatarHandler);

module.exports = router;
