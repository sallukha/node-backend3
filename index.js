const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const connectDB = require("./db/config");

connectDB();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = "your_secret_key"; // Replace with env variable in production

const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:3000', 'https://transcendent-medicare-ea040.netlify.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Import models
const User = require("./model/user_modal");
const Patient = require("./model/patient");

// ✅ Routes
const patientRoutes = require("./routes/patient2");
app.use("/patient", patientRoutes);

// ✅ Middleware to protect routes
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "Invalid user credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "Lax",
      maxAge: 3600000 // 1 hour
    });

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

    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000
    });

    res.status(201).json({ message: "Signup successful", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// ✅ Protected Create Patient Route
app.post("/patient", verifyToken, async (req, res) => {
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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
