const multer = require('multer');

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

const attachmentUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 20,
  },
}).array('files', 20);

function uploadAttachments(req, res, next) {
  attachmentUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Error processing the files.', errorCode: 'VALIDATION_ERROR' });
    }
    next();
  });
}

module.exports = { upload, uploadAttachments };
