const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const User = require('./models/user'); // Import the Usr model

// Load environment variables
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

// Function to seed the first admin
const seedAdmin = async () => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    console.log('Checking for admin user...');

    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Start the server
const startServer = async () => {
  await seedAdmin(); // Ensure the admin user is created before starting the server
  app.listen(port, () => {
    console.log(`🚀Server is running on http://localhost:${port}`);
  });
};

startServer();
