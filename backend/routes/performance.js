const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');

router.get('/', async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate('staff')
      .populate('coursesDelivered')
      .populate('evaluatedBy');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/staff/:staffId', async (req, res) => {
  try {
    const performances = await Performance.find({ staff: req.params.staffId })
      .populate('coursesDelivered')
      .populate('evaluatedBy');
    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const performance = new Performance(req.body);
  try {
    const newPerformance = await performance.save();
    res.status(201).json(newPerformance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    if (!performance) return res.status(404).json({ message: 'Performance not found' });
    Object.assign(performance, req.body);
    const updatedPerformance = await performance.save();
    res.json(updatedPerformance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    if (!performance) return res.status(404).json({ message: 'Performance not found' });
    res.json({ message: 'Performance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
