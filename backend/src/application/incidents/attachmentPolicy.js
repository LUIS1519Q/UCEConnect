const ATTACHMENT_POLICY = {
  maxFilesPerUpload: 5,
  categories: {
    image: {
      mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSizeBytes: 10 * 1024 * 1024,
      cloudinaryResourceType: 'image',
    },
    document: {
      mimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      maxSizeBytes: 10 * 1024 * 1024,
      cloudinaryResourceType: 'raw',
    },
    video: {
      mimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
      maxSizeBytes: 50 * 1024 * 1024,
      cloudinaryResourceType: 'video',
    },
  },
};

function resolveCategory(mimetype) {
  return (
    Object.keys(ATTACHMENT_POLICY.categories).find((category) =>
      ATTACHMENT_POLICY.categories[category].mimeTypes.includes(mimetype)
    ) || null
  );
}

function isAllowedMimeType(mimetype) {
  return resolveCategory(mimetype) !== null;
}

function maxSizeForMimeType(mimetype) {
  const category = resolveCategory(mimetype);
  return category ? ATTACHMENT_POLICY.categories[category].maxSizeBytes : 0;
}

function resourceTypeForMimeType(mimetype) {
  const category = resolveCategory(mimetype);
  return category ? ATTACHMENT_POLICY.categories[category].cloudinaryResourceType : null;
}

module.exports = {
  ATTACHMENT_POLICY,
  resolveCategory,
  isAllowedMimeType,
  maxSizeForMimeType,
  resourceTypeForMimeType,
};
