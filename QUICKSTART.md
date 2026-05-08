# Quick Start Guide

## Prerequisites

- Node.js installed
- MongoDB running locally

## Quick Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm start
```

Server runs on: http://localhost:5000

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

App opens on: http://localhost:3000

## Test the System

### Sample Data to Add

#### 1. Add a Staff Member

- Go to Staff Management
- Click "Add New Staff"
- Fill details:
  - Staff ID: P001
  - First Name: John
  - Last Name: Doe
  - Email: john@university.edu
  - Department: Computer Science
  - Role: Professor

#### 2. Add a Room

- Go to Room Management
- Click "Add New Room"
- Fill details:
  - Room Number: 101
  - Building: Science Hall
  - Floor: 1
  - Capacity: 30
  - Type: Classroom

#### 3. Add a Course

- Go to Course Management
- Click "Add New Course"
- Fill details:
  - Course Code: CS101
  - Title: Introduction to Computer Science
  - Credits: 3
  - Type: Core
  - Department: Computer Science

#### 4. Add a Student

- Go to Student Management
- Click "Add New Student"
- Fill details:
  - Student ID: STU001
  - First Name: Alice
  - Last Name: Smith
  - Email: alice@student.edu
  - Department: Computer Science

#### 5. Create an Enrollment

- Go to Enrollment Management
- Click "Add New Enrollment"
- Select the student and course
- Set grade to "Pending"

#### 6. Add Timetable Entry

- Go to Timetable Management
- Click "Add New Timetable Entry"
- Select course, instructor, room
- Set day and time

## Features Overview

### Dashboard

- View system statistics
- Monitor total students, courses, staff, rooms

### Student Management

- Add, edit, delete students
- Track student status and GPA

### Course Management

- Create and manage courses
- Assign instructors and set capacity

### Staff Management

- Manage faculty and teaching assistants
- Track qualifications and office locations

### Room Management

- Schedule and track room availability
- Manage facilities and capacity

### Enrollment Management

- Handle student-course enrollments
- Track grades and attendance

### Timetable Management

- Schedule classes
- Manage course timings and locations

## Common Operations

### Edit Any Record

1. Find the record in the table
2. Click the "Edit" button
3. Modify the information
4. Click "Update" to save

### Delete Any Record

1. Find the record in the table
2. Click the "Delete" button
3. Confirm the deletion

## API Testing

You can test the API using tools like Postman:

```
GET http://localhost:5000/api/students
GET http://localhost:5000/api/courses
GET http://localhost:5000/api/staff
GET http://localhost:5000/api/rooms
GET http://localhost:5000/api/dashboard
```

## Troubleshooting

**Backend won't start:**

- Ensure MongoDB is running
- Check port 5000 is not in use
- Verify dependencies are installed

**Frontend won't load:**

- Ensure backend is running
- Check port 3000 is not in use
- Clear browser cache

**CORS errors:**

- Verify backend is running on port 5000
- Check frontend API URL is correct

Enjoy using the University Management System!
