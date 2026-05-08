const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  parentId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  relationship: { type: String, enum: ['Mother', 'Father', 'Guardian', 'Other'], required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  address: String,
  emergencyContact: String,
  communicationPreference: { type: String, enum: ['Email', 'SMS', 'Phone', 'Portal'], default: 'Email' },
  registrationDate: { type: Date, default: Date.now },
  studentProgress: [{
    report: String,
    date: Date,
    overallGrade: String
  }],
  notifications: [{
    announcement: String,
    readDate: Date,
    isRead: Boolean
  }]
}, { timestamps: true });

module.exports = mongoose.model('Parent', parentSchema);
