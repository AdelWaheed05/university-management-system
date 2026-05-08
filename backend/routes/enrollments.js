const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('student').populate('course');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrollments for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId }).populate('course');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create enrollment
router.post('/', async (req, res) => {
  const enrollment = new Enrollment(req.body);
  try {
    const newEnrollment = await enrollment.save();
    
    // Update student's enrolled courses
    if (req.body.student) {
      await Student.findByIdAndUpdate(req.body.student, {
        $push: { enrolledCourses: req.body.course }
      });
    }

    // Update course enrollment count
    if (req.body.course) {
      await Course.findByIdAndUpdate(req.body.course, {
        $inc: { enrolledStudents: 1 }
      });
    }

    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update enrollment
router.patch('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    Object.assign(enrollment, req.body);
    const updatedEnrollment = await enrollment.save();
    res.json(updatedEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    
    // Update student's enrolled courses
    if (enrollment.student) {
      await Student.findByIdAndUpdate(enrollment.student, {
        $pull: { enrolledCourses: enrollment.course }
      });
    }

    // Update course enrollment count
    if (enrollment.course) {
      await Course.findByIdAndUpdate(enrollment.course, {
        $inc: { enrolledStudents: -1 }
      });
    }

    res.json({ message: 'Enrollment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
