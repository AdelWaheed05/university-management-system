const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examId: { type: String, required: true, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  examType: { type: String, enum: ['Midterm', 'Final', 'Quiz', 'Practical'], required: true },
  scheduledDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  maxScore: { type: Number, default: 100 },
  totalQuestions: Number,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  results: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    score: Number,
    gradeDate: Date,
    feedback: String
  }],
  status: { type: String, enum: ['Scheduled', 'Completed', 'Graded'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
