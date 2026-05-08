const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course')
      .populate('createdBy');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/course/:courseId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('createdBy');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const assignment = new Assignment(req.body);
  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    Object.assign(assignment, req.body);
    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
