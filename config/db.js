const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,      // Database user
  process.env.DB_PASSWORD,  // User password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,  // Optional: default to 5432 if not specified
    logging: false,  // Disable query logging for cleaner output
  }
);

// Export the Sequelize instance
module.exports = sequelize;
