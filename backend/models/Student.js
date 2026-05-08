const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  dateOfBirth: Date,
  address: String,
  department: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
  gpa: { type: Number, default: 0 },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
