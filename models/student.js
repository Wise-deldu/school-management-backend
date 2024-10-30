const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Student extends Model {}

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
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admissionNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['A', 'B', 'C', 'D']],
      },
    },
  },
  {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
    timestamps: true,
    hooks: {
      // Use `afterCreate` to update the admissionNumber
      async afterCreate(student) {
        const paddedId = String(student.id).padStart(4, '0'); // Example: 0001
        student.admissionNumber = `STU${paddedId}`; // Example: STU0001
        await student.save(); // Save the updated admissionNumber
      },
    },
  }
);

module.exports = Student;
