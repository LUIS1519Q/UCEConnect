const multer = require('multer');
const { ATTACHMENT_POLICY, isAllowedMimeType } = require('../../../application/incidents/attachmentPolicy');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const attachmentFileFilter = (req, file, cb) => {
  if (isAllowedMimeType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido.'), false);
  }
};

const attachmentUpload = multer({
  storage,
  fileFilter: attachmentFileFilter,
  limits: {
    fileSize: ATTACHMENT_POLICY.categories.video.maxSizeBytes,
    files: ATTACHMENT_POLICY.maxFilesPerUpload,
  },
}).array('files', ATTACHMENT_POLICY.maxFilesPerUpload);

function uploadAttachments(req, res, next) {
  attachmentUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Error al procesar los archivos.', errorCode: 'VALIDATION_ERROR' });
    }
    next();
  });
}

module.exports = { upload, uploadAttachments };
