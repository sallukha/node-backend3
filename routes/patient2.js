// routes/patient2.js

const express = require("express");
const router = express.Router();
const Patient = require("../model/patient"); // ✅ fixed the path (use "../" instead of "./" because it's in a subfolder)

// GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

module.exports = router;
