const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  leaveId: { type: String, required: true, unique: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  leaveType: { type: String, enum: ['Sick Leave', 'Vacation', 'Maternity', 'Study Leave', 'Other'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  numberOfDays: Number,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  approvalDate: Date,
  comments: String
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
