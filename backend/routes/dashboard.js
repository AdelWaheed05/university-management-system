const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const Staff = require('../models/Staff');
const Room = require('../models/Room');
const Enrollment = require('../models/Enrollment');

// Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalStaff = await Staff.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const activeCourses = await Course.countDocuments({ type: 'Core' });
    const professorsCount = await Staff.countDocuments({ role: 'Professor' });
    
    const stats = {
      totalStudents,
      totalCourses,
      totalStaff,
      totalRooms,
      totalEnrollments,
      activeStudents,
      activeCourses,
      professorsCount
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
