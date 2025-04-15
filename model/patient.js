const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    admission_date: { type: Date, required: true },
    discharge_date: { type: Date, default: null },
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
