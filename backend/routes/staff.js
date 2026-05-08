const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().populate('coursesTaught');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single staff member
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('coursesTaught');
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create staff member
router.post('/', async (req, res) => {
  const staff = new Staff(req.body);
  try {
    const newStaff = await staff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update staff member
router.patch('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    Object.assign(staff, req.body);
    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete staff member
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff member not found' });
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
