const Settings = require('../../domain/settings/Settings');

function rowToSettings(row) {
  if (!row) return null;
  return new Settings({
    id: row.id,
    applicationName: row.application_name,
    version: row.version,
    description: row.description,
    institution: row.institution,
    contactEmail: row.contact_email,
    contactWebsite: row.contact_website,
    developedBy: row.developed_by,
    copyright: row.copyright,
    logoUrl: row.logo_url,
    maxFilesPerUpload: row.max_files_per_upload,
    maxImageSizeBytes: row.max_image_size_bytes,
    maxDocumentSizeBytes: row.max_document_size_bytes,
    maxVideoSizeBytes: row.max_video_size_bytes,
    allowedImageTypes: row.allowed_image_types,
    allowedDocumentTypes: row.allowed_document_types,
    allowedVideoTypes: row.allowed_video_types,
    updatedAt: row.updated_at,
  });
}

class PostgresSettingsRepo {
  constructor(db) {
    this.db = db;
  }

  async findSettings() {
    const result = await this.db.query('SELECT * FROM about_info LIMIT 1');
    return rowToSettings(result.rows[0]);
  }

  async updateSettings(data) {
    const fields = [];
    const params = [];

    const columnMap = {
      applicationName: 'application_name',
      contactEmail: 'contact_email',
      maxFilesPerUpload: 'max_files_per_upload',
      maxImageSizeBytes: 'max_image_size_bytes',
      maxDocumentSizeBytes: 'max_document_size_bytes',
      maxVideoSizeBytes: 'max_video_size_bytes',
    };
    const jsonColumnMap = {
      allowedImageTypes: 'allowed_image_types',
      allowedDocumentTypes: 'allowed_document_types',
      allowedVideoTypes: 'allowed_video_types',
    };

    Object.entries(columnMap).forEach(([key, column]) => {
      if (data[key] !== undefined) {
        params.push(data[key]);
        fields.push(`${column} = $${params.length}`);
      }
    });
    Object.entries(jsonColumnMap).forEach(([key, column]) => {
      if (data[key] !== undefined) {
        params.push(JSON.stringify(data[key]));
        fields.push(`${column} = $${params.length}`);
      }
    });

    const result = await this.db.query(
      `UPDATE about_info SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = (SELECT id FROM about_info LIMIT 1)
       RETURNING *`,
      params
    );
    return rowToSettings(result.rows[0]);
  }

  async updateLogo(logoUrl) {
    const result = await this.db.query(
      `UPDATE about_info SET logo_url = $1, updated_at = NOW()
       WHERE id = (SELECT id FROM about_info LIMIT 1)
       RETURNING *`,
      [logoUrl]
    );
    return rowToSettings(result.rows[0]);
  }
}

module.exports = PostgresSettingsRepo;
