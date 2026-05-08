const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  resourceId: { type: String, required: true, unique: true },
  resourceName: { type: String, required: true },
  type: { type: String, enum: ['Equipment', 'Software License', 'Digital Resource', 'Physical Asset'], required: true },
  description: String,
  quantity: { type: Number, required: true },
  department: { type: String, required: true },
  allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { type: String, enum: ['Available', 'In Use', 'Maintenance'], default: 'Available' },
  purchaseDate: Date,
  expiryDate: Date,
  cost: Number,
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
