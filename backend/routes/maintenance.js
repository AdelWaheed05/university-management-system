const express = require('express');
const router = express.Router();
const MaintenanceIssue = require('../models/MaintenanceIssue');

router.get('/', async (req, res) => {
  try {
    const issues = await MaintenanceIssue.find()
      .populate('room')
      .populate('reportedBy')
      .populate('assignedTo');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const issue = await MaintenanceIssue.findById(req.params.id)
      .populate('room')
      .populate('reportedBy')
      .populate('assignedTo');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const issue = new MaintenanceIssue(req.body);
  try {
    const newIssue = await issue.save();
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const issue = await MaintenanceIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    Object.assign(issue, req.body);
    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const issue = await MaintenanceIssue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
