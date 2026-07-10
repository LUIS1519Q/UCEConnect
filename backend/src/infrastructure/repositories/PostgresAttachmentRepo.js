const Attachment = require('../../domain/incidents/Attachment');

function rowToAttachment(row) {
  if (!row) return null;
  return new Attachment({
    id: row.id,
    incidentId: row.incident_id,
    cloudinaryUrl: row.cloudinary_url,
    fileType: row.file_type,
    mimeType: row.mime_type,
    originalFilename: row.original_filename,
    sizeBytes: row.size_bytes,
    uploadedBy: row.uploaded_by,
    uploadedByName: row.uploaded_by_name,
    uploadedAt: row.uploaded_at,
  });
}

class PostgresAttachmentRepo {
  constructor(db) {
    this.db = db;
  }

  async save(attachment) {
    const inserted = await this.db.query(
      `INSERT INTO attachments
         (incident_id, cloudinary_url, file_type, mime_type, original_filename, size_bytes, uploaded_by, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id`,
      [
        attachment.incidentId,
        attachment.cloudinaryUrl,
        attachment.fileType,
        attachment.mimeType,
        attachment.originalFilename,
        attachment.sizeBytes,
        attachment.uploadedBy,
      ]
    );

    const result = await this.db.query(
      `SELECT a.id, a.incident_id, a.cloudinary_url, a.file_type, a.mime_type,
              a.original_filename, a.size_bytes, a.uploaded_by, a.uploaded_at,
              u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM attachments a
       LEFT JOIN users u ON a.uploaded_by = u.id
       WHERE a.id = $1`,
      [inserted.rows[0].id]
    );

    return rowToAttachment(result.rows[0]);
  }

  async findByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT a.id, a.incident_id, a.cloudinary_url, a.file_type, a.mime_type,
              a.original_filename, a.size_bytes, a.uploaded_by, a.uploaded_at,
              u.first_name || ' ' || u.last_name as uploaded_by_name
       FROM attachments a
       LEFT JOIN users u ON a.uploaded_by = u.id
       WHERE a.incident_id = $1
       ORDER BY a.uploaded_at ASC`,
      [incidentId]
    );
    return result.rows.map(rowToAttachment);
  }
}

module.exports = PostgresAttachmentRepo;
