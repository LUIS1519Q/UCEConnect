const Incident = require('../../domain/incidents/Incident');

function rowToIncident(row) {
  if (!row) return null;
  return new Incident({
    id: row.id,
    title: row.title,
    description: row.description,
    categoryId: row.category_id,
    priority: row.priority,
    aiSummary: row.ai_summary,
    status: row.status,
    createdBy: row.created_by,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    categoryName: row.category_name || null,
    createdByName: row.created_by_name || null,
    assignedToName: row.assigned_to_name || null,
  });
}

class PostgresIncidentRepo {
  constructor(db) {
    this.db = db;
  }

  async create(incident) {
    const result = await this.db.query(
      `INSERT INTO incidents
         (title, description, category_id, priority, ai_summary, status, created_by, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        incident.title,
        incident.description,
        incident.categoryId,
        incident.priority,
        incident.aiSummary,
        incident.status,
        incident.createdBy,
        incident.assignedTo,
      ]
    );
    return rowToIncident(result.rows[0]);
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT i.*,
              c.name  AS category_name,
              u1.name AS created_by_name,
              u2.name AS assigned_to_name
       FROM incidents i
       LEFT JOIN categories c  ON i.category_id = c.id
       LEFT JOIN users u1      ON i.created_by  = u1.id
       LEFT JOIN users u2      ON i.assigned_to = u2.id
       WHERE i.id = $1`,
      [id]
    );
    return rowToIncident(result.rows[0]);
  }

  async findAll({ userId, status, categoryId, page, limit }) {
    const params = [];
    const conditions = [];

    if (userId !== undefined) {
      params.push(userId);
      conditions.push(`i.created_by = $${params.length}`);
    }
    if (status !== undefined) {
      params.push(status);
      conditions.push(`i.status = $${params.length}`);
    }
    if (categoryId !== undefined) {
      params.push(categoryId);
      conditions.push(`i.category_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const offset = (page - 1) * limit;
    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataResult = await this.db.query(
      `SELECT i.*,
              c.name  AS category_name,
              u1.name AS created_by_name,
              u2.name AS assigned_to_name
       FROM incidents i
       LEFT JOIN categories c  ON i.category_id = c.id
       LEFT JOIN users u1      ON i.created_by  = u1.id
       LEFT JOIN users u2      ON i.assigned_to = u2.id
       ${where}
       ORDER BY i.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      params
    );

    const countParams = params.slice(0, params.length - 2);
    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM incidents i ${where}`,
      countParams
    );

    return {
      data: dataResult.rows.map(rowToIncident),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async updateStatus(id, status) {
    const result = await this.db.query(
      `UPDATE incidents
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );
    return rowToIncident(result.rows[0]);
  }

  async saveHistory(incidentId, status, changedBy, note) {
    await this.db.query(
      `INSERT INTO incident_history (incident_id, status, changed_by, note)
       VALUES ($1, $2, $3, $4)`,
      [incidentId, status, changedBy, note || null]
    );
  }

  async findHistoryByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT h.*, u.name AS changed_by_name
       FROM incident_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.incident_id = $1
       ORDER BY h.changed_at ASC`,
      [incidentId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      incidentId: row.incident_id,
      status: row.status,
      changedBy: row.changed_by,
      changedByName: row.changed_by_name,
      note: row.note,
      changedAt: row.changed_at,
    }));
  }

  async categoryExists(categoryId) {
    const result = await this.db.query(
      `SELECT id FROM categories WHERE id = $1 AND is_active = true`,
      [categoryId]
    );
    return result.rows.length > 0;
  }
}

module.exports = PostgresIncidentRepo;
