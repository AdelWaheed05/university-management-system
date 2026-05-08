# University Management System (UMS) v1.0

A comprehensive, production-ready University Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). Organized into **4 major modules** following Agile/Scrum methodology.

## 🎯 System Overview

The UMS is structured around 4 core business modules:

- **FACILITIES MODULE** 🏢 - Resource and facility management
- **CURRICULUM MODULE** 📚 - Academic programs and course delivery
- **STAFF MODULE** 👥 - Human resources and personnel management
- **COMMUNITY MODULE** 🤝 - Communication and engagement

## 📋 Modules & Features

### 1. FACILITIES MODULE 🏢

**Room Management, Resource Allocation, Maintenance Tracking**

- Room booking system with availability tracking
- Equipment and software license management
- Maintenance issue reporting and tracking
- Priority-based issue assignment
- Department-wise resource allocation

### 2. CURRICULUM MODULE 📚

**Course Management, Assignments, Exams, Learning Materials**

- Course catalog with prerequisites and requirements
- Assignment creation with rubric grading
- Examination scheduling with room allocation
- Learning material upload (videos, documents, quizzes)
- Grade tracking and academic records

### 3. STAFF MODULE 👥

**Staff Directory, Performance Tracking, Leave Management, Payroll**

- Comprehensive staff directory
- Performance evaluation system (1-5 ratings)
- Leave request and approval workflow
- Payroll management with deductions/allowances
- Research publication tracking

### 4. COMMUNITY MODULE 🤝

**Announcements, Events, Messaging, Parent Portal**

- University-wide announcements with priority levels
- Event calendar with registration
- Direct messaging (student-staff, parent-teacher)
- Secure parent portal for progress tracking
- Student academic progress visibility

## Project Structure

```
backend/
├── models/
│   ├── Student.js
│   ├── Course.js
│   ├── Staff.js
│   ├── Room.js
│   ├── Enrollment.js
│   └── Timetable.js
├── routes/
│   ├── students.js
│   ├── courses.js
│   ├── staff.js
│   ├── rooms.js
│   ├── enrollments.js
│   ├── timetables.js
│   └── dashboard.js
├── package.json
└── server.js

frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── StudentManagement.js
│   │   ├── CourseManagement.js
│   │   ├── StaffManagement.js
│   │   ├── RoomManagement.js
│   │   ├── EnrollmentManagement.js
│   │   └── TimetableManagement.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── public/
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (if needed):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university_management
```

4. Start MongoDB:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

5. Run the backend server:

```bash
npm start
# or for development with auto-reload
npx nodemon server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student
- `POST /api/students` - Create a new student
- `PATCH /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Courses

- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `POST /api/courses` - Create a new course
- `PATCH /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Staff

- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get a specific staff member
- `POST /api/staff` - Create a new staff member
- `PATCH /api/staff/:id` - Update a staff member
- `DELETE /api/staff/:id` - Delete a staff member

### Rooms

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room
- `PATCH /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Enrollments

- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/student/:studentId` - Get enrollments for a student
- `POST /api/enrollments` - Create a new enrollment
- `PATCH /api/enrollments/:id` - Update an enrollment
- `DELETE /api/enrollments/:id` - Delete an enrollment

### Timetables

- `GET /api/timetables` - Get all timetable entries
- `GET /api/timetables/course/:courseId` - Get timetables for a course
- `GET /api/timetables/room/:roomId` - Get timetables for a room
- `POST /api/timetables` - Create a new timetable entry
- `PATCH /api/timetables/:id` - Update a timetable entry
- `DELETE /api/timetables/:id` - Delete a timetable entry

### Dashboard

- `GET /api/dashboard` - Get system statistics

## Data Models

### Student

```javascript
{
  studentId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  dateOfBirth: Date,
  address: String,
  department: String,
  enrollmentDate: Date,
  status: String (Active/Inactive/Graduated),
  gpa: Number,
  enrolledCourses: [Course ID]
}
```

### Course

```javascript
{
  code: String (unique),
  title: String,
  description: String,
  credits: Number,
  type: String (Core/Elective),
  department: String,
  instructor: Staff ID,
  capacity: Number,
  enrolledStudents: Number,
  semester: String,
  prerequisites: [String]
}
```

### Staff

```javascript
{
  staffId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  department: String,
  officeLocation: String,
  officeHours: String,
  role: String (Professor/Associate Professor/TA/Admin),
  qualification: String,
  hireDate: Date,
  coursesTaught: [Course ID],
  status: String (Active/Inactive/Leave)
}
```

### Room

```javascript
{
  roomNumber: String (unique),
  building: String,
  floor: Number,
  capacity: Number,
  type: String (Classroom/Lab/Auditorium/Seminar),
  facilities: [String],
  isAvailable: Boolean,
  bookings: [{
    startTime: Date,
    endTime: Date,
    purpose: String,
    course: Course ID
  }]
}
```

### Enrollment

```javascript
{
  student: Student ID,
  course: Course ID,
  enrollmentDate: Date,
  grade: String (A/B/C/D/F/Pending),
  attendance: Number,
  status: String (Active/Dropped/Completed)
}
```

### Timetable

```javascript
{
  course: Course ID,
  instructor: Staff ID,
  room: Room ID,
  dayOfWeek: String (Monday/Tuesday/Wednesday/Thursday/Friday),
  startTime: String (HH:MM),
  endTime: String (HH:MM),
  semester: String,
  capacity: Number
}
```

## Usage Guide

### Adding a Student

1. Navigate to Students section
2. Click "Add New Student"
3. Fill in the form with student details
4. Click "Create Student"

### Creating a Course

1. Navigate to Courses section
2. Click "Add New Course"
3. Enter course information (code, title, credits, etc.)
4. Click "Create Course"

### Managing Enrollments

1. Navigate to Enrollments section
2. Click "Add New Enrollment"
3. Select a student and course
4. Set the grade and status
5. Click "Create Enrollment"

### Setting up Timetable

1. Navigate to Timetable section
2. Click "Add New Timetable Entry"
3. Select course, instructor, and room
4. Set day and time
5. Click "Create Timetable Entry"

## Technologies Used

### Backend

- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-Origin Resource Sharing
- **Dotenv**: Environment variable management

### Frontend

- **React**: JavaScript library for building UI
- **React Router**: Client-side routing
- **Fetch API**: Data fetching

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running (`brew services start mongodb-community`)
- Check the connection string in server.js
- Verify the database name is correct

### CORS Errors

- Ensure the backend CORS middleware is properly configured
- Check that the frontend API URL matches the backend URL

### Port Already in Use

- Change the PORT in backend `.env` file or server.js
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

## Future Enhancements

- User authentication and authorization
- Email notifications
- Grade management and transcripts
- Attendance tracking
- Advanced reporting and analytics
- Mobile app version
- Payment integration for fees
- Student portal with academic history

## License

ISC

## Support

For issues and support, please contact the development team.
