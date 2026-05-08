const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollmentDate: { type: Date, default: Date.now },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F', 'Pending'], default: 'Pending' },
  attendance: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Dropped', 'Completed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
