 const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  contactNumber: { // ✅ corrected spelling here
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  reportType: {
    type: String,
    enum: ['Lab Test', 'OPD', 'IPD', 'Surgery'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
