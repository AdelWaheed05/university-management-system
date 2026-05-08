const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  payrollId: { type: String, required: true, unique: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  paymentMonth: { type: Date, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  bonusAmount: { type: Number, default: 0 },
  taxDeduction: { type: Number, default: 0 },
  netSalary: Number,
  paymentStatus: { type: String, enum: ['Pending', 'Processed', 'Paid'], default: 'Pending' },
  paymentDate: Date,
  benefits: [String],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
