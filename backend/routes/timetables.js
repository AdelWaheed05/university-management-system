const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// Get all timetables
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find().populate('course').populate('instructor').populate('room');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get timetables for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const timetables = await Timetable.find({ course: req.params.courseId })
      .populate('instructor')
      .populate('room');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get timetables for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const timetables = await Timetable.find({ room: req.params.roomId })
      .populate('course')
      .populate('instructor');
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create timetable entry
router.post('/', async (req, res) => {
  const timetable = new Timetable(req.body);
  try {
    const newTimetable = await timetable.save();
    res.status(201).json(newTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update timetable entry
router.patch('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable entry not found' });
    Object.assign(timetable, req.body);
    const updatedTimetable = await timetable.save();
    res.json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete timetable entry
router.delete('/:id', async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable entry not found' });
    res.json({ message: 'Timetable entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
