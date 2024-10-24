require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Assuming Sequelize ORM is used
const SALT_ROUNDS = 12; // Set salt rounds for bcrypt
exports.register = async (req, res) => {
  try {
    const { username, password, role , staffID, studentID} = req.body;

    // Validate the required fields
    if (!username || !password || !role ) {
      return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user using Sequelize's create method
    const user = await User.create({
      username,  // Make sure this is correct
      password: hashedPassword,
      role,
      staffID,
      studentID
    });

    // Return the user data in the response
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, role: user.role, staffID: user.staffID, studentID: user.studentID },
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

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT secret not configured');
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
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
