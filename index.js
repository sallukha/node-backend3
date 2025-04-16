const express = require("express")
const cors = require('cors')
const app = express()
require('./db/config')
const model = require("./model/user_modal")
const modal = require("./model/patient")
const connectDB = require('./db/config');
const patient = require("./model/patient")
app.use(express.json())
const corsOptions = {
  origin: ['http://localhost:3000/', 'https://transcendent-heliotrope-ea0403.netlify.app/'], // ya tumhara frontend URL (e.g., https://your-site.netlify.app)
  methods: ['GET', 'POST'],
  credentials: true
}
app.use(cors())
const port = 4000
// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body
  await connectDB();
  try {
    const user = await model.findOne({ email, password })

    if (!user) {
      return res.status(404).json({ message: "Invalid user credentials" })
    }

    res.status(200).json({ message: "Login successful", user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "An error occurred during login", error: error.message })
  }
})

// Signup Route
app.post('/signup', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }
  await connectDB();
  const { fullname, email, password } = req.body;
  console.log({})
  try {
    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = new model({ fullname, email, password, });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'Signup successful', user: savedUser });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
})
app.post("/patient", async (res, req) => {
  await connectDB()
  const { name, age, gender, contactNumber, reportType, paymentStatus, fromDate, toDate } = req.body

  if (!patientName || !age || !gender || !contactNumber || !reportType || !paymentStatus || !formData || !toDate) {
    return res.status(4000).json({ message: "Missing required patient data" })
  }
  const newPatient = new patient({
    name,
    age,
    gender,
    contactNumber,
    reportType,
    paymentStatus,
    fromDate,
    toDate
  })
  const savedPatient = newPatient.save()
  req.status(201).json({ message: "Patient added successfully", patient: savedPatient })
})
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
