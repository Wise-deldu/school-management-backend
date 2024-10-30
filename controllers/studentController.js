const Student = require('../models/student'); // Import the Sequelize model
const { Op } = require('sequelize'); // For Sequelize queries

// Add a new student with auto-generated admission number
exports.addStudent = async (req, res) => {
  try {
    // Check if the authenticated user has an 'admin' role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { firstName, lastName, class: studentClass } = req.body;

    // Validate input
    if (!firstName || !lastName || !studentClass) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const currentYear = new Date().getFullYear().toString().slice(-2);

    const lastStudent = await Student.findOne({
      where: { admissionNumber: { [Op.like]: `${currentYear}%` } },
      order: [['admissionNumber', 'DESC']],
    });

    let nextNumber = lastStudent
      ? parseInt(lastStudent.admissionNumber.slice(2)) + 1
      : parseInt(`${currentYear}0001`);

    const admissionNumber = nextNumber.toString().padStart(7, '0');

    const student = await Student.create({
      firstName,
      lastName,
      class: studentClass,
      admissionNumber,
    });

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll(); // Fetch all students

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found.' });
    }

    res.status(200).json(students); // Return the list of students
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params; // Extract student ID from the URL
    const student = await Student.findByPk(id); // Find student by primary key

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json(student); // Return the student data
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
