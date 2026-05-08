const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  subject: String,
  content: { type: String, required: true },
  attachments: [String],
  isRead: { type: Boolean, default: false },
  messageType: { type: String, enum: ['Question', 'Meeting Request', 'Academic Guidance', 'General'], default: 'General' },
  sentDate: { type: Date, default: Date.now },
  replies: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    content: String,
    sentDate: Date,
    attachments: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
