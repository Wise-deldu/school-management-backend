const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {
  // Static method to create a new user with auto-generated staffID
  static async createUser(username, hashedPassword = null, role = 'user') {
    const nextStaffID = await this.generateNextStaffID(); // Generate next staffID

    return await User.create({
      username,
      password: hashedPassword, // Initially null
      role,
      staffID: nextStaffID,
    });
  }

  // Generate the next sequential staffID with the "STA" prefix
  static async generateNextStaffID() {
    const lastUser = await User.findOne({
      attributes: ['staffID'],
      where: { staffID: { [Op.like]: 'STA%' } },
      order: [['staffID', 'DESC']],
    });

    if (!lastUser) return 'STA0001'; // If no user exists, start from 'STA0001'

    const lastNumericPart = parseInt(lastUser.staffID.slice(3), 10);
    const nextNumericPart = (lastNumericPart + 1).toString().padStart(4, '0');

    return `STA${nextNumericPart}`;
  }

  // Static method to find a user by username
  static async findByUsername(username) {
    try {
      return await User.findOne({ where: { username } });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
}

// Initialize the User model schema
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    staffID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true, // Initially null
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = User;
