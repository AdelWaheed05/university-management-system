const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Core Routes
const studentsRoutes = require('./routes/students');
const coursesRoutes = require('./routes/courses');
const staffRoutes = require('./routes/staff');
const roomsRoutes = require('./routes/rooms');
const enrollmentsRoutes = require('./routes/enrollments');
const timetablesRoutes = require('./routes/timetables');
const dashboardRoutes = require('./routes/dashboard');

// Import Facilities Module Routes
const resourcesRoutes = require('./routes/resources');
const maintenanceRoutes = require('./routes/maintenance');

// Import Curriculum Module Routes
const assignmentsRoutes = require('./routes/assignments');
const examsRoutes = require('./routes/exams');
const materialsRoutes = require('./routes/materials');

// Import Staff Module Routes
const performanceRoutes = require('./routes/performance');
const leavesRoutes = require('./routes/leaves');
const payrollRoutes = require('./routes/payroll');

// Import Community Module Routes
const messagesRoutes = require('./routes/messages');
const announcementsRoutes = require('./routes/announcements');
const eventsRoutes = require('./routes/events');
const parentsRoutes = require('./routes/parents');

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/university_management')
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Root Route
app.get('/', (req, res) => res.json({ 
  message: 'University Management System API', 
  modules: ['Core', 'Facilities', 'Curriculum', 'Staff', 'Community']
}));

// Core Routes
app.use('/api/students', studentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/timetables', timetablesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Facilities Module Routes
app.use('/api/resources', resourcesRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Curriculum Module Routes
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/materials', materialsRoutes);

// Staff Module Routes
app.use('/api/performance', performanceRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/payroll', payrollRoutes);

// Community Module Routes
app.use('/api/messages', messagesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/parents', parentsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));