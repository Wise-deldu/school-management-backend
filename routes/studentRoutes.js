const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, adminOnly, staffOrAdmin } = require('../middleware/auth'); // Import middleware

// Route to add a new student (Admin only)
router.post('/', authenticateToken, adminOnly, studentController.addStudent);

// Route to get all students (Admin or Staff can access)
router.get('/', authenticateToken, staffOrAdmin, studentController.getAllStudents);

// Route to get a single student by ID (Admin or Staff can access)
router.get('/:id', authenticateToken, staffOrAdmin, studentController.getStudentById);

module.exports = router;
