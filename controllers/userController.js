const User = require('../models/user');

// Controller to create a new user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, role } = req.body;

    // Validate input
    if (!username || !role) {
      return res.status(400).json({ error: 'Username and role are required' });
    }

    // Check if the requester is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create new users' });
    }

    // Check if the username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Create the new user with default fields (no password yet)
    const user = await User.createUser(username, null, role);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        staffID: user.staffID,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
