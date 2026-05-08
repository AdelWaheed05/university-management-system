const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  announcementId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Administrative', 'Event', 'Deadline', 'Maintenance', 'General'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  postedDate: { type: Date, default: Date.now },
  expiryDate: Date,
  attachments: [String],
  targetAudience: { type: String, enum: ['All', 'Students', 'Staff', 'Faculty', 'Specific Department'], default: 'All' },
  department: String,
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
