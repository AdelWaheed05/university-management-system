const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('course')
      .populate('room')
      .populate('createdBy');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/course/:courseId', async (req, res) => {
  try {
    const exams = await Exam.find({ course: req.params.courseId })
      .populate('room')
      .populate('createdBy');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const exam = new Exam(req.body);
  try {
    const newExam = await exam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    Object.assign(exam, req.body);
    const updatedExam = await exam.save();
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
