const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

class CloudinaryService {
  async uploadAttachment(fileBuffer, incidentId, resourceType) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `uceconnect/incidents/${incidentId}/attachments`,
          resource_type: resourceType,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(fileBuffer);
    });
  }
}

module.exports = new CloudinaryService();
