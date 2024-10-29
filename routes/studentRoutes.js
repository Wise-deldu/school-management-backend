const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getAllStudents, getStudentById, addStudent } = require('../controllers/studentController'); // Import controllers
const router = express.Router();

// Route to add a new student
router.post('/', authenticateToken, addStudent);

// Route to get all students
router.get('/', authenticateToken, getAllStudents);

// Route to get a student by ID
router.get('/:id', authenticateToken, getStudentById);

// Placeholder route for student creation (can be implemented later)
router.post('/', authenticateToken, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
