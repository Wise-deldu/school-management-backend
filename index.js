const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');


dotenv.config();

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/students', studentRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the School Management System API' });
});

// 404 Handler (for undefined routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// General Error Handler (for server errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
