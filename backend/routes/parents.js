const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');

router.get('/', async (req, res) => {
  try {
    const parents = await Parent.find().populate('student');
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const parents = await Parent.find({ student: req.params.studentId });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const parent = new Parent(req.body);
  try {
    const newParent = await parent.save();
    res.status(201).json(newParent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    Object.assign(parent, req.body);
    const updatedParent = await parent.save();
    res.json(updatedParent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.json({ message: 'Parent deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
