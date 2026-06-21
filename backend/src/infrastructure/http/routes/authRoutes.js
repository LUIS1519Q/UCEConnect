const { Router } = require('express');
const { z } = require('zod');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().refine((value) => value.endsWith('@uce.edu.ec'), {
    message: 'El correo debe ser institucional (@uce.edu.ec)',
  }),
  password: z
    .string()
    .min(8)
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
  role: z.enum(['student', 'manager', 'admin']).default('student'),
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
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z
    .string()
    .min(8)
    .regex(/\d/, 'La contraseña debe contener al menos un número'),
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

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-code', validate(verifySchema), authController.verifyCode);
router.post('/login', validate(loginSchema), authController.login);
router.post('/resend-code', validate(resendSchema), authController.resendCode);
router.post('/forgot-password', validate(forgotSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetSchema), authController.resetPassword);

router.get('/microsoft', authController.microsoftLogin);
router.get('/microsoft/callback', authController.microsoftCallback);

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
