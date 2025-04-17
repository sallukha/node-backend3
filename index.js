const express = require("express");
const cors = require("cors");
const connectDB = require("./db/config");
const patientRoutes = require("./routes/patient2");
const User = require("./model/user_modal");

const app = express();
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5174', 'http://localhost:3000', 'https://transcendent-medicare-ea040.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

// ✅ Logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// ✅ Patient Routes
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

// ✅ Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
