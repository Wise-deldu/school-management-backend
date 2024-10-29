const Student = require('../models/student'); // Import the Sequelize model
const { Op } = require('sequelize'); // For Sequelize queries

// Add a new student with auto-generated admission number
exports.addStudent = async (req, res) => {
    try {
      const { firstName, lastName, class: studentClass } = req.body;
  
      // Validate input
      if (!firstName || !lastName || !studentClass) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Get the current year in "YY" format (e.g., "24" for 2024)
      const currentYear = new Date().getFullYear().toString().slice(-2);
  
      // Find the highest existing admission number for the current year
      const lastStudent = await Student.findOne({
        where: {
          admissionNumber: { [Op.like]: `${currentYear}%` },
        },
        order: [['admissionNumber', 'DESC']], // Sort by admission number in descending order
      });
  
      // Determine the next admission number
      let nextNumber;
      if (lastStudent) {
        // Increment the last number by 1
        const lastNumber = parseInt(lastStudent.admissionNumber.slice(2)); // Extract the numeric part
        nextNumber = lastNumber + 1;
      } else {
        // If no student exists for the year, start with the first number
        nextNumber = parseInt(`${currentYear}0001`);
      }
  
      // Format the next number with leading zeros (e.g., 0240001)
      const admissionNumber = nextNumber.toString().padStart(7, '0');
  
      // Create the new student
      const student = await Student.create({
        firstName,
        lastName,
        class: studentClass,
        admissionNumber,
      });
  
      res.status(201).json({
        message: 'Student added successfully',
        student,
      });
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
