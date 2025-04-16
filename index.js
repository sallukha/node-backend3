const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db/config");

// ✅ Connect to MongoDB
connectDB();
app.use(express.json());

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'https://transcendent-medicare-ea040.netlify.app' // 🚫 no slash at end!
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ handle preflight for all routes

// ✅ Import Models
const User = require("./model/user_modal");
const Patient = require("./model/patient");

// ✅ Routes
const patientRoutes = require("./routes/patient2");
app.use("/patient", patientRoutes);

// ✅ Login Route
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
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// ✅ Signup Route
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

// ✅ Create Patient Route
app.post("/patient", async (req, res) => {
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

// ✅ Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
