const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');


// Define the User model
class User extends Model {
  // Static method to create a new user
  static async createUser(id, username, hashedPassword, role, staffID, studentID) {
    return await User.create({ id, username, password: hashedPassword, role, staffID, studentID });
  }

  // Static method to find a user by username
  static async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  // Instance method to validate password
  async validatePassword(password, bcrypt) {
    return await bcrypt.compare(password, this.password);
  }
}

// Initialize the User model schema
User.init(
  {
    id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      primaryKey: true,
      unique: true,
      autoIncrement: true, // Generate a UUID and limit it to 20 characters
    },
    username: {
      type: DataTypes.STRING(20), // Limit username to 20 characters
      allowNull: true,
      unique: true,
      validate: {
        len: [1, 20], // Ensure username is between 1 and 20 characters
      },
    },
    staffID: {
      type: DataTypes.STRING(50), // Limit username to 20 characters
      allowNull: true,
      unique: true,
      validate: {
        len: [1, 20], // Ensure username is between 1 and 20 characters
      },
    },
    studentID: {
      type: DataTypes.STRING(50), // Limit username to 20 characters
      allowNull: true,
      unique: true,
      validate: {
        len: [1, 20], // Ensure username is between 1 and 20 characters
      },
    },
    password: {
      type: DataTypes.STRING(60), // Store hashed password (bcrypt length is ~60)
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(20), // Ensure role does not exceed 20 characters
      defaultValue: 'user',
      validate: {
        len: [1, 20], // Ensure role is between 1 and 20 characters
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Map to the 'users' table
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

module.exports = User;
