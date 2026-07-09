const InternalNote = require('../../domain/incidents/InternalNote');

function rowToInternalNote(row) {
  if (!row) return null;
  return new InternalNote({
    id: row.id,
    incidentId: row.incident_id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorRole: row.author_role,
    message: row.message,
    createdAt: row.created_at,
  });
}

class PostgresInternalNoteRepo {
  constructor(db) {
    this.db = db;
  }

  async save(note) {
    const inserted = await this.db.query(
      `INSERT INTO internal_notes (incident_id, author_id, message, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, incident_id, author_id, message, created_at`,
      [note.incidentId, note.authorId, note.message, note.createdAt]
    );

    const result = await this.db.query(
      `SELECT n.id, n.incident_id, n.author_id, n.message, n.created_at,
              u.first_name || ' ' || u.last_name as author_name,
              r.name as author_role
       FROM internal_notes n
       LEFT JOIN users u ON n.author_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE n.id = $1`,
      [inserted.rows[0].id]
    );

    return rowToInternalNote(result.rows[0]);
  }

  async findByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT n.id, n.incident_id, n.author_id, n.message, n.created_at,
              u.first_name || ' ' || u.last_name as author_name,
              r.name as author_role
       FROM internal_notes n
       LEFT JOIN users u ON n.author_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE n.incident_id = $1
       ORDER BY n.created_at ASC`,
      [incidentId]
    );
    return result.rows.map(rowToInternalNote);
  }
}

module.exports = PostgresInternalNoteRepo;
