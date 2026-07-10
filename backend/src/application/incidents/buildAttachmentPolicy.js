function buildAttachmentPolicy(settings) {
  const categories = {
    image: {
      mimeTypes: settings.allowedImageTypes,
      maxSizeBytes: settings.maxImageSizeBytes,
      cloudinaryResourceType: 'image',
    },
    document: {
      mimeTypes: settings.allowedDocumentTypes,
      maxSizeBytes: settings.maxDocumentSizeBytes,
      cloudinaryResourceType: 'raw',
    },
    video: {
      mimeTypes: settings.allowedVideoTypes,
      maxSizeBytes: settings.maxVideoSizeBytes,
      cloudinaryResourceType: 'video',
    },
  };

  function resolveCategory(mimetype) {
    return (
      Object.keys(categories).find((category) => categories[category].mimeTypes.includes(mimetype)) || null
    );
  }

  function isAllowedMimeType(mimetype) {
    return resolveCategory(mimetype) !== null;
  }

  function maxSizeForMimeType(mimetype) {
    const category = resolveCategory(mimetype);
    return category ? categories[category].maxSizeBytes : 0;
  }

  function resourceTypeForMimeType(mimetype) {
    const category = resolveCategory(mimetype);
    return category ? categories[category].cloudinaryResourceType : null;
  }

  return {
    maxFilesPerUpload: settings.maxFilesPerUpload,
    categories,
    resolveCategory,
    isAllowedMimeType,
    maxSizeForMimeType,
    resourceTypeForMimeType,
  };
}

module.exports = buildAttachmentPolicy;
