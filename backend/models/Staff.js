const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  department: { type: String, required: true },
  officeLocation: String,
  officeHours: String,
  role: { type: String, enum: ['Professor', 'Associate Professor', 'TA', 'Admin'], required: true },
  qualification: String,
  hireDate: { type: Date, default: Date.now },
  coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  status: { type: String, enum: ['Active', 'Inactive', 'Leave'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);