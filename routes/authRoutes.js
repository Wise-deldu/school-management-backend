const express = require('express');
const { register, login, getUser, updateUser, deleteUser } = require('../controllers/authController');
const router = express.Router();

// User Registration and Login Routes
router.post('/register', register);
router.post('/login', login);

// CRUD Routes for Users
router.get('/get', getUser);  
router.delete('/delete', deleteUser);
router.put('/update', updateUser);    // Get a user by ID


module.exports = router;
