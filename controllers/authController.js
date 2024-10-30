require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Import Sequelize operators
const User = require('../models/user'); // Assuming Sequelize ORM is used
const SALT_ROUNDS = 12; // Set salt rounds for bcrypt

// Generate the next staffID with "STA" prefix
async function generateNextStaffID() {
  const lastUser = await User.findOne({
    attributes: ['staffID'],
    where: { staffID: { [Op.like]: 'STA%' } },
    order: [['staffID', 'DESC']],
  });

  if (!lastUser) return 'STA0001'; // Start from 'STA0001' if no users exist

  const lastNumericPart = parseInt(lastUser.staffID.slice(3), 10); // Extract numeric part
  const nextNumericPart = (lastNumericPart + 1).toString().padStart(4, '0'); // Pad with zeros

  return `STA${nextNumericPart}`; // Return the new staffID
}

// Generate the next studentID with "STU" prefix
async function generateNextStudentID() {
  const lastUser = await User.findOne({
    attributes: ['studentID'],
    where: { studentID: { [Op.like]: 'STU%' } },
    order: [['studentID', 'DESC']],
  });

  if (!lastUser) return 'STU00001'; // Start from 'STU00001' if no users exist

  const lastNumericPart = parseInt(lastUser.studentID.slice(3), 10); // Extract numeric part
  const nextNumericPart = (lastNumericPart + 1).toString().padStart(5, '0'); // Pad with zeros

  return `STU${nextNumericPart}`; // Return the new studentiD
}

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate the required fields
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    // Check if the user is trying to create an admin
    if (role === 'admin') {
      const userCount = await User.count({ where: { role: 'admin' } });
      if (userCount > 0) {
        return res.status(403).json({ error: 'Admin user already exists. Only one admin can be created.' });
      }
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Generate staffID or studentID based on role
    let staffID = null;
    let studentID = null;
    if (role === 'staff') {
      staffID = await generateNextStaffID();
    } else if (role === 'student') {
      studentID = await generateNextStudentID();
    }

    // Create a new user using Sequelize's create method
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      staffID,
      studentID,
    });

    // Return the user data in the response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        staffID: user.staffID,
        studentID: user.studentID,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username is provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log(`No user found with username: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password from the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ensure JWT secret is set
    if (!process.env.JWT_SECRET) {
      console.error('JWT secret not configured');
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`User ${username} logged in successfully`);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a user by ID from body
exports.getUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a user by ID from body
exports.updateUser = async (req, res) => {
  try {
    const { id, username, role, password } = req.body;

    if (!id || !username || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the password if it's being updated
    const updatedData = { username, role };
    if (password) {
      updatedData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.update(updatedData);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a user by ID from body
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
