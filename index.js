 const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const connectDB = require("./db/config");
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:3000', 'https://transcendent-medicare-ea040.netlify.app'],
  methods: ['GET', 'POST', 'OPTIONS', 'PUT'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Models
const User = require("./model/user_modal");
const Patient = require("./model/patient");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

                          ; // keep this in .env in production

// ✅ Routes
const patientRoutes = require("./routes/patient2");
app.use("/patient", patientRoutes);

// ✅ Signup Route (hash password)
app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hash the password

    const newUser = new User({ fullname, email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "Signup successful", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ✅ Login Route (compare password + generate JWT)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid user" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production with https
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// ✅ Patient Routes (unchanged)
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

app.put("/patient/:id", async (req, res) => {
  const { name, age, gender, contactNumber, reportType, paymentStatus, fromDate, toDate } = req.body;

  if (!name || !age || !gender || !contactNumber || !reportType || !paymentStatus || !fromDate || !toDate) {
    return res.status(400).json({ message: "Missing required patient data" });
  }

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, gender, contactNumber, reportType, paymentStatus, fromDate, toDate },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
