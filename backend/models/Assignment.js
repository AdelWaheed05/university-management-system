const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  assignmentId: { type: String, required: true, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['Homework', 'Project', 'Essay', 'Problem Set'], required: true },
  dueDate: { type: Date, required: true },
  maxScore: { type: Number, default: 100 },
  attachmentUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    submissionDate: Date,
    fileUrl: String,
    score: Number,
    feedback: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
