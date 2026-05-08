const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  eventType: { type: String, enum: ['Academic', 'Sports', 'Cultural', 'Seminar', 'Workshop', 'Conference'], required: true },
  date: { type: Date, required: true },
  startTime: String,
  endTime: String,
  location: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  expectedAttendees: Number,
  registeredAttendees: Number,
  imageUrl: String,
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'], default: 'Upcoming' },
  isPublic: { type: Boolean, default: true },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
