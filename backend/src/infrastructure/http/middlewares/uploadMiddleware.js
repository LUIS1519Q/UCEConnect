const multer = require('multer');
const { ATTACHMENT_POLICY, isAllowedMimeType } = require('../../../application/incidents/attachmentPolicy');

const storage = multer.memoryStorage();

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

module.exports = { uploadAttachments };
