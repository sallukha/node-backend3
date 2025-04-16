 

const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db/config");

// Connect MongoDB
connectDB();

app.use(express.json()); 

// ✅ CORS setup
const corsOptions = {
  origin: ['http://localhost:5174', 'https://transcendent-heliotrope-ea0403.netlify.app'],
  methods: ['GET', 'POST',"OPTIONS"],
  credentials: true
};
app.use(cors(corsOptions));

// ✅ Import models
const User = require("./model/user_modal");
const Patient = require("./model/patient");

// ✅ Import routes
const patientRoutes = require("./routes/patient2");
app.use("/patient", patientRoutes); 

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: "Invalid user credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login", error: error.message });
  }
});

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ fullname, email, password });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "Signup successful", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ✅ CREATE PATIENT
app.post("/patient", async (req, res) => {
  const {
    name,
    age,
    gender,
    contactNumber,
    reportType,
    paymentStatus,
    fromDate,
    toDate,
  } = req.body;

  // Field validation
  if (!name || !age || !gender || !contactNumber || !reportType || !paymentStatus || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing required patient data" });
  }

  try {
    const newPatient = new Patient({
      name,
      age,
      gender,
      contactNumber,
      reportType,
      paymentStatus,
      fromDate,
      toDate,
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({ message: "Patient added successfully", patient: savedPatient });
  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
