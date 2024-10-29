const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

// Define the User model
class User extends Model {
  // Static method to create a new user with auto-generated staffID
  static async createUser(username, hashedPassword, role = 'user', studentID = null) {
    const nextStaffID = await User.generatedNextStaffID(); // Generate next staffID
    console.log(`Generated Staff ID: ${nextStaffID}`); // Debug to verify generation

    return await User.create({
      username,
      password: hashedPassword,
      role,
      staffID: nextStaffID,
      studentID,
    });
  }

  // Generate the next sequential staffID with the "STA" prefix
  static async generateNextStaffID() {
    const lastUser = await User.findOne({
      attributes: ['staffID'],
      where: { staffID: { [Op.like]: 'STA%' } }, // Filster staff IDs starting with 'STA'
      order: [['staffID', 'DESC']], // Get the lastest staffID in descending order
    });

    if (!lastUser) return 'STA0001'; // If no user exists, start from 'STA0001'

    const lastNumericPart = parseInt(lastUser.staffID.slice(3), 10); // Extract number after 'STA'
    const nextNumericPart = (lastNumbericPart + 1).toString().padStart(4, '0'); // Ensure 4-digit padding

    return `STA${nextNumericPart}`; // Construct the new staffID with "STA" prefix
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

  // Instance method to validate password
  async validatePassword(password, bcrypt) {
    return await bcrypt.compare(password, this.password);
  }
}

// Initialize the User model schema
User.init(
  {
    id: {
      type: DataTypes.INTEGER, // Change to integer if auto-incrementing
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Enable auto-increment
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20],
      },
    },
    staffID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        len: [1, 50], // Adjusted validation
      },
    },
    studentID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        len: [1, 50], // Adjusted validation
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false, // Ensure password is required
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user',
      validate: {
        len: [1, 20],
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false, // Can be changed to true if needed
  }
);

module.exports = User;
