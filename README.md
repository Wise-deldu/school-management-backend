# School Management System - Backend

This is the backend server for the School Management System. It provides API endpoints for managing student admissions, attendance, grades, and user authentication.

## Table of Contents

- [School Management System - Backend](#school-management-system---backend)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Tech Stack](#tech-stack)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
    - [API Endpoints](#api-endpoints)
      - [Authentication](#authentication)
    - [Students](#students)
      - [Attendance](#attendance)
      - [Grades](#grades)

---

## Project Overview

The School Management System allows schools to handle:
- **Student Admissions**: Registration and management of student profiles.
- **Attendance Tracking**: Record student attendance.
- **Grades Management**: Store and retrieve grades for students.
- **Authentication**: Basic access control for users of the system.

## Tech Stack

- **Node.js** - Backend runtime
- **Express.js** - Web framework for API
- **Sequelize** - ORM for database interactions
- **PostgreSQL** - Relational database for storing data
- **JWT** - JSON Web Tokens for authentication

## Setup and Installation

### Prerequisites

Ensure you have the following installed:
- Node.js v12 or higher
- PostgreSQL
- Git

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/school-management-backend.git
   cd school-management-backend

2. **Install dependencies:**
```
npm install
```

3. **Setup PostgreSQL Database:**
* Create a new PostgreSQL database (e.g., school_management).
* Update your environment variables with your database details

4. **Run database migrations:**
```
npx sequelize-cli db:migrate
```

5. **Start the server:**
```
npm start
```
`The server should now be running at http://localhost:3000`

### Environment Variables
Create a `.env` file in the root of the project with the following variables:
```
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/school_management
JWT_SECRET=your_jwt_secret
```
* Replace `username` and `password` with your PostgreSQL credentials.
* Set `JWT_SECRET` to a secure string for token encryption.

### API Endpoints
#### Authentication
* POST /api/auth/login
    Authenticate a user and receive a JWT token.

### Students
* GET /api/students
Retrieve a list of all students.

* POST /api/students
Add a new student.

* GET /api/students/
Retrieve a specific student by ID.

* PUT /api/students/
Update student information.

* DELETE /api/students/
Delete a student record.

#### Attendance
* POST /api/attendance
Record attendance for a student.

* GET /api/attendance/
Get attendance records for a specific student.

#### Grades
* POST /api/grades
Record grades for a student.

* GET /api/grades/
Retrieve grades for a specific student.
