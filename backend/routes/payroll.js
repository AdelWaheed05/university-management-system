const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');

router.get('/', async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('staff');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/staff/:staffId', async (req, res) => {
  try {
    const payrolls = await Payroll.find({ staff: req.params.staffId });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const payroll = new Payroll(req.body);
  try {
    const newPayroll = await payroll.save();
    res.status(201).json(newPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    Object.assign(payroll, req.body);
    const updatedPayroll = await payroll.save();
    res.json(updatedPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });
    res.json({ message: 'Payroll deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
