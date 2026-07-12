const Notification = require('../../domain/notifications/Notification');

function rowToNotification(row) {
  if (!row) return null;
  return new Notification({
    id: row.id,
    userId: row.user_id,
    incidentId: row.incident_id,
    ticket: row.ticket || null,
    type: row.type,
    title: row.message,
    read: row.is_read,
    createdAt: row.created_at,
  });
}

class PostgresNotificationRepo {
  constructor(db) {
    this.db = db;
  }

  async save(notification) {
    const result = await this.db.query(
      `INSERT INTO notifications (user_id, incident_id, type, message, is_read, created_at)
       VALUES ($1, $2, $3, $4, false, NOW())
       RETURNING *`,
      [notification.userId, notification.incidentId, notification.type, notification.title]
    );
    return rowToNotification(result.rows[0]);
  }

  async findByUserId(userId, { page = 1, limit = 10, unread } = {}) {
    const params = [userId];
    let where = 'WHERE n.user_id = $1';
    if (unread) {
      where += ' AND n.is_read = false';
    }

    const offset = (page - 1) * limit;
    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataResult = await this.db.query(
      `SELECT n.*, i.ticket
       FROM notifications n
       LEFT JOIN incidents i ON n.incident_id = i.id
       ${where}
       ORDER BY n.created_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      params
    );

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM notifications n ${where}`,
      [userId]
    );

    return {
      data: dataResult.rows.map(rowToNotification),
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count, 10),
      },
    };
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [id]
    );
    return rowToNotification(result.rows[0]);
  }

  async markAsRead(id) {
    await this.db.query(
      `UPDATE notifications SET is_read = true WHERE id = $1`,
      [id]
    );
  }
}

module.exports = PostgresNotificationRepo;
