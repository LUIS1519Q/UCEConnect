const Observation = require('../../domain/incidents/Observation');

function rowToObservation(row) {
  if (!row) return null;
  return new Observation({
    id: row.id,
    incidentId: row.incident_id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorRole: row.author_role,
    message: row.message,
    createdAt: row.created_at,
  });
}

class PostgresObservationRepo {
  constructor(db) {
    this.db = db;
  }

  async save(observation) {
    const inserted = await this.db.query(
      `INSERT INTO observations (incident_id, author_id, message, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, incident_id, author_id, message, created_at`,
      [observation.incidentId, observation.authorId, observation.message, observation.createdAt]
    );

    const result = await this.db.query(
      `SELECT o.id, o.incident_id, o.author_id, o.message, o.created_at,
              u.first_name || ' ' || u.last_name as author_name,
              r.name as author_role
       FROM observations o
       LEFT JOIN users u ON o.author_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE o.id = $1`,
      [inserted.rows[0].id]
    );

    return rowToObservation(result.rows[0]);
  }

  async findByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT o.id, o.incident_id, o.author_id, o.message, o.created_at,
              u.first_name || ' ' || u.last_name as author_name,
              r.name as author_role
       FROM observations o
       LEFT JOIN users u ON o.author_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE o.incident_id = $1
       ORDER BY o.created_at ASC`,
      [incidentId]
    );
    return result.rows.map(rowToObservation);
  }
}

module.exports = PostgresObservationRepo;
