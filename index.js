const express = require("express")
const cors = require('cors')
const app = express()
require('./db/config')
const model = require("./model/user_modal")
app.use(express.json())
const corsOptions = {
    origin:[ 'http://localhost:3000/', 'https://transcendent-heliotrope-ea0403.netlify.app/'], // ya tumhara frontend URL (e.g., https://your-site.netlify.app)
    methods: ['GET', 'POST'],
    credentials: true
}

app.use(cors(corsOptions))

const port = 4000

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body

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
    const { fullName, email, password, confirmPassword } = req.body

    try {
        const existingUser = await model.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" })
        }

        const newUser = new model({ fullName, email, password, confirmPassword })
        const data = await newUser.save()

        res.status(201).json({ message: "Signup successful", data })
    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({ message: "An error occurred during signup", error: error.message })
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
