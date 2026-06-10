// authRoutes.js — Adaptador de infraestructura: rutas HTTP de autenticación
// Define los endpoints públicos de auth, validando el cuerpo de cada petición
// con Zod antes de delegar en el controlador.

const { Router } = require('express');
const { z } = require('zod');

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// --- Esquemas de validación ---

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

// --- Middleware de validación genérico ---
// Recibe un esquema de Zod y valida req.body antes de continuar al controlador.
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

// --- Rutas ---

router.post('/register', validate(registerSchema), authController.register);
router.post('/verify-code', validate(verifySchema), authController.verifyCode);
router.post('/login', validate(loginSchema), authController.login);

// Ruta protegida de prueba — confirma que el JWT se valida y expone req.user
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
