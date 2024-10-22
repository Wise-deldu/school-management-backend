const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO user (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role
      `;
    const values = [username, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }
}

module.exports = User;
