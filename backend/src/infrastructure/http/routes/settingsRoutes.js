const { Router } = require('express');
const { z } = require('zod');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const settingsController = require('../controllers/settingsController');

const router = Router();

const updateSettingsSchema = z
  .object({
    applicationName: z.string().min(2).max(100).optional(),
    contactEmail: z.string().email().optional(),
    maxFilesPerUpload: z.coerce.number().int().min(1).max(20).optional(),
    maxImageSizeBytes: z.coerce.number().int().min(1).optional(),
    maxDocumentSizeBytes: z.coerce.number().int().min(1).optional(),
    maxVideoSizeBytes: z.coerce.number().int().min(1).optional(),
    allowedImageTypes: z.array(z.string()).min(1).optional(),
    allowedDocumentTypes: z.array(z.string()).min(1).optional(),
    allowedVideoTypes: z.array(z.string()).min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
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

router.get('/', authMiddleware, settingsController.getSettings);

router.patch(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  validate(updateSettingsSchema),
  settingsController.updateSettings
);

router.post(
  '/logo',
  authMiddleware,
  roleMiddleware('admin'),
  upload.single('logo'),
  settingsController.uploadLogo
);

module.exports = router;
