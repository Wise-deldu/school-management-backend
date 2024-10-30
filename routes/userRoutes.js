const express = require('express');
const { authenticateToken, adminOnly } = require('../middleware/auth');
const { createUser } = require('../controllers/userController');

const router = express.Router();

// Route to create a new user (admin only)
router.post('/users', authenticateToken, adminOnly, createUser);

module.exports = router;
