const Incident = require('../../domain/incidents/Incident');

function rowToIncident(row) {
  if (!row) return null;
  return new Incident({
    id: row.id,
    ticket: row.ticket,
    title: row.title,
    description: row.description,
    categoryId: row.category_id,
    priority: row.priority,
    aiSummary: row.ai_summary,
    status: row.status,
    statusReason: row.status_reason,
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

    const row = result.rows[0];
    const ticketResult = await this.db.query(
      `UPDATE incidents
       SET ticket = 'INC-' || TO_CHAR(created_at, 'YYYY') || '-' || LPAD(id::TEXT, 4, '0')
       WHERE id = $1
       RETURNING ticket`,
      [row.id]
    );
    row.ticket = ticketResult.rows[0].ticket;

    return rowToIncident(row);
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
    const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'rejected', 'cancelled'];
    const params = [];
    const conditions = [];

    if (userId !== undefined) {
      params.push(userId);
      conditions.push(`i.created_by = $${params.length}`);
    }
    if (status !== undefined && VALID_STATUSES.includes(status)) {
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

  async updateStatus(id, status, statusReason) {
    const result = await this.db.query(
      `UPDATE incidents
       SET status = $1, status_reason = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, statusReason, id]
    );
    return rowToIncident(result.rows[0]);
  }

  async updateCategory(id, categoryId) {
    const result = await this.db.query(
      `UPDATE incidents SET category_id = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, categoryId]
    );
    return rowToIncident(result.rows[0]);
  }

  async update(id, { title, description, categoryId }) {
    const result = await this.db.query(
      `UPDATE incidents
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, categoryId, id]
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
      `SELECT h.id, h.incident_id, h.status, h.note,
              h.changed_at, u.name AS changed_by_name, u.id AS changed_by_id
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
      changedById: row.changed_by_id,
      changedByName: row.changed_by_name,
      note: row.note,
      changedAt: row.changed_at instanceof Date ? row.changed_at.toISOString() : row.changed_at,
    }));
  }

  async findObservationsByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT o.id, o.incident_id, o.message, o.created_at,
              u.name AS author_name, u.id AS author_id, r.name AS author_role
       FROM observations o
       LEFT JOIN users u ON o.author_id = u.id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE o.incident_id = $1
       ORDER BY o.created_at ASC`,
      [incidentId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      incidentId: row.incident_id,
      message: row.message,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
      authorName: row.author_name,
      authorId: row.author_id,
      authorRole: row.author_role,
    }));
  }

  async countObservationsByIncidentId(incidentId) {
    const result = await this.db.query(
      `SELECT COUNT(*) FROM observations WHERE incident_id = $1`,
      [incidentId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async categoryExists(categoryId) {
    const result = await this.db.query(
      `SELECT id FROM categories WHERE id = $1 AND is_active = true`,
      [categoryId]
    );
    return result.rows.length > 0;
  }

  async findCategoryIdByName(name) {
    const result = await this.db.query(
      `SELECT id FROM categories WHERE name = $1 AND is_active = true`,
      [name]
    );
    return result.rows[0] ? result.rows[0].id : null;
  }

  async countByStatus() {
    const result = await this.db.query(`SELECT status, COUNT(*) FROM incidents GROUP BY status`);
    return result.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});
  }

  async countByDay(days) {
    const result = await this.db.query(
      `SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS date, COUNT(i.id) AS count
       FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, interval '1 day') AS d(day)
       LEFT JOIN incidents i ON DATE(i.created_at) = d.day
       GROUP BY d.day
       ORDER BY d.day ASC`,
      [days]
    );
    return result.rows.map((row) => ({ date: row.date, count: parseInt(row.count, 10) }));
  }

  async countByStatusInRange(startDate, endDate) {
    const result = await this.db.query(
      `SELECT status, COUNT(*) FROM incidents WHERE created_at >= $1 AND created_at < $2 GROUP BY status`,
      [startDate, endDate]
    );
    return result.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});
  }

  async countByCategoryInRange(startDate, endDate) {
    const result = await this.db.query(
      `SELECT COALESCE(c.name, 'Sin categoría') as category_name, COUNT(i.id) as count
       FROM incidents i
       LEFT JOIN categories c ON i.category_id = c.id
       WHERE i.created_at >= $1 AND i.created_at < $2
       GROUP BY c.name
       ORDER BY count DESC`,
      [startDate, endDate]
    );
    return result.rows.map((row) => ({ category: row.category_name, count: parseInt(row.count, 10) }));
  }
}

module.exports = PostgresIncidentRepo;
