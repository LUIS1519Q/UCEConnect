const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

class CloudinaryService {
  async uploadAvatar(fileBuffer, userId) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'uceconnect/avatars',
          public_id: `user_${userId}`,
          overwrite: true,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(fileBuffer);
    });
  }

  async deleteAvatar(userId) {
    try {
      await cloudinary.uploader.destroy(`uceconnect/avatars/user_${userId}`);
    } catch (err) {
    }
  }

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
