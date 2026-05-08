const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  performanceId: { type: String, required: true, unique: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  evaluationYear: Number,
  teachingQuality: { type: Number, min: 1, max: 5 },
  researchPublications: Number,
  studentFeedback: Number,
  administrativeContribution: { type: String },
  coursesDelivered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  professionalDevelopment: [String],
  overallRating: { type: Number, min: 1, max: 5 },
  evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  comments: String,
  evaluationDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
