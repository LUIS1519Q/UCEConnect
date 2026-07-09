const HelpItem = require('../../domain/settings/HelpItem');

function rowToHelpItem(row) {
  if (!row) return null;
  return new HelpItem({
    id: row.id,
    question: row.question,
    answer: row.answer,
    order: row.order,
  });
}

class PostgresHelpItemRepo {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const result = await this.db.query(
      `SELECT id, question, answer, "order" FROM help_items ORDER BY "order" ASC`
    );
    return result.rows.map(rowToHelpItem);
  }

  async findById(id) {
    const result = await this.db.query(
      `SELECT id, question, answer, "order" FROM help_items WHERE id = $1`,
      [id]
    );
    return rowToHelpItem(result.rows[0]);
  }

  async create({ question, answer, order }) {
    const result = await this.db.query(
      `INSERT INTO help_items (question, answer, "order") VALUES ($1, $2, $3) RETURNING id, question, answer, "order"`,
      [question, answer, order || 0]
    );
    return rowToHelpItem(result.rows[0]);
  }

  async update(id, { question, answer, order }) {
    const fields = [];
    const params = [id];

    if (question !== undefined) {
      params.push(question);
      fields.push(`question = $${params.length}`);
    }
    if (answer !== undefined) {
      params.push(answer);
      fields.push(`answer = $${params.length}`);
    }
    if (order !== undefined) {
      params.push(order);
      fields.push(`"order" = $${params.length}`);
    }

    const result = await this.db.query(
      `UPDATE help_items SET ${fields.join(', ')} WHERE id = $1 RETURNING id, question, answer, "order"`,
      params
    );
    return rowToHelpItem(result.rows[0]);
  }

  async delete(id) {
    await this.db.query('DELETE FROM help_items WHERE id = $1', [id]);
  }
}

module.exports = PostgresHelpItemRepo;
