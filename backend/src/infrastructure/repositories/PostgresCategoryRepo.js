const Category = require('../../domain/categories/Category');

function rowToCategory(row) {
  if (!row) return null;
  return new Category({
    id: row.id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
  });
}

class PostgresCategoryRepo {
  constructor(db) {
    this.db = db;
  }

  async create(category) {
    const result = await this.db.query(
      `INSERT INTO categories (name, description, is_active) VALUES ($1, $2, $3) RETURNING *`,
      [category.name, category.description, category.isActive]
    );
    return rowToCategory(result.rows[0]);
  }

  async findAll({ isActive } = {}) {
    const params = [];
    let where = '';
    if (isActive !== undefined) {
      params.push(isActive);
      where = `WHERE is_active = $1`;
    }
    const result = await this.db.query(`SELECT * FROM categories ${where} ORDER BY name ASC`, params);
    return result.rows.map(rowToCategory);
  }

  async findById(id) {
    const result = await this.db.query(`SELECT * FROM categories WHERE id = $1`, [id]);
    return rowToCategory(result.rows[0]);
  }

  async findByName(name) {
    const result = await this.db.query(`SELECT * FROM categories WHERE name = $1`, [name]);
    return rowToCategory(result.rows[0]);
  }

  async update(id, { name, description, isActive }) {
    const fields = [];
    const params = [id];

    if (name !== undefined) {
      params.push(name);
      fields.push(`name = $${params.length}`);
    }
    if (description !== undefined) {
      params.push(description);
      fields.push(`description = $${params.length}`);
    }
    if (isActive !== undefined) {
      params.push(isActive);
      fields.push(`is_active = $${params.length}`);
    }

    const result = await this.db.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return rowToCategory(result.rows[0]);
  }
}

module.exports = PostgresCategoryRepo;
