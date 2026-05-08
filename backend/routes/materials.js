const express = require('express');
const router = express.Router();
const LearningMaterial = require('../models/LearningMaterial');

router.get('/', async (req, res) => {
  try {
    const materials = await LearningMaterial.find()
      .populate('course')
      .populate('uploadedBy');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/course/:courseId', async (req, res) => {
  try {
    const materials = await LearningMaterial.find({ course: req.params.courseId })
      .populate('uploadedBy');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const material = new LearningMaterial(req.body);
  try {
    const newMaterial = await material.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const material = await LearningMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    Object.assign(material, req.body);
    const updatedMaterial = await material.save();
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const material = await LearningMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
