class Category {
  constructor({ id, name, description, isActive }) {
    this.id = id;
    this.name = name;
    this.description = description || null;
    this.isActive = isActive;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
    };
  }
}

module.exports = Category;
