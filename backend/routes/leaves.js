const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('staff')
      .populate('approvedBy');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/staff/:staffId', async (req, res) => {
  try {
    const leaves = await Leave.find({ staff: req.params.staffId })
      .populate('approvedBy');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const leave = new Leave(req.body);
  try {
    const newLeave = await leave.save();
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    Object.assign(leave, req.body);
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    res.json({ message: 'Leave request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
