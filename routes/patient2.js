const express = require("express");
const router = express.Router();
const Patient = require("../model/patient");

// ✅ Add Patient
router.post("/", async (req, res) => {
  const { name, age, gender, contactNumber, reportType, paymentStatus, fromDate, toDate } = req.body;

  if (!name || !age || !gender || !contactNumber || !reportType || !paymentStatus || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing required patient data" });
  }

  try {
    const newPatient = new Patient({ name, age, gender, contactNumber, reportType, paymentStatus, fromDate, toDate });
    const savedPatient = await newPatient.save();
    res.status(201).json({ message: "Patient added successfully", patient: savedPatient });
  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ (Optional) Get All Patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
});

module.exports = router;
