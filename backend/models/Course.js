const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  credits: { type: Number, required: true },
  type: { type: String, enum: ['Core', 'Elective'], required: true },
  department: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  capacity: { type: Number, default: 30 },
  enrolledStudents: { type: Number, default: 0 },
  semester: String,
  prerequisites: [String]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);