const mongoose = require('mongoose');

const maintenanceIssueSchema = new mongoose.Schema({
  issueId: { type: String, required: true, unique: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  issueType: { type: String, enum: ['Equipment', 'Infrastructure', 'Cleaning', 'Electrical', 'Other'], required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Reported', 'In Progress', 'Resolved'], default: 'Reported' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  reportedDate: { type: Date, default: Date.now },
  resolvedDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  comments: String
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceIssue', maintenanceIssueSchema);
