const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  semester: { type: String, required: true },
  capacity: Number
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
