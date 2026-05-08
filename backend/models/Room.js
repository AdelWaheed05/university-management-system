const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  building: { type: String, required: true },
  floor: Number,
  type: { type: String, enum: ['Classroom', 'Lab', 'Auditorium', 'Seminar'], default: 'Classroom' },
  facilities: [String],
  isAvailable: { type: Boolean, default: true },
  bookings: [{
    startTime: Date,
    endTime: Date,
    purpose: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);