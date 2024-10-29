const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db'); // Import database instance

// Extend Sequelize's Model class
class Student extends Model {}

// Define the Student model schema and configuration
Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensure the name isn't an empty string
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    admissionNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [7, 10], // Ensure a valid length (e.g., "0240001")
      },
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'B', 'C', 'D']], // Example: Allow only certain classes
      },
    },
  },
  {
    sequelize, // Pass the Sequelize instance
    modelName: 'Student', // Define the model name
    tableName: 'students', // Optional: Explicitly define table name
    timestamps: true, // Enable createdAt and updatedAt timestamps
  }
);

module.exports = Student;
