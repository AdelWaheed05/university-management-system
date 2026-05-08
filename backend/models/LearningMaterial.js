const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({
  materialId: { type: String, required: true, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Lecture Notes', 'Video', 'Article', 'Ebook', 'Code Example', 'Other'], required: true },
  description: String,
  url: String,
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  uploadDate: { type: Date, default: Date.now },
  accessLevel: { type: String, enum: ['Public', 'Class Only', 'Restricted'], default: 'Class Only' },
  views: { type: Number, default: 0 },
  resources: [{
    title: String,
    url: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema);
