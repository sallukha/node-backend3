const express = require("express")
const cors = require('cors')
const app = express()
require('./db/config')
const model = require("./model/user_modal")

app.use(express.json())
app.use(cors(
))

const port = 4000

// Login Route
app.post("/log_in", async (req, res) => {
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
app.post('/sign_up', async (req, res) => {
    const { username, email, password, cPassword } = req.body

    try {
        const existingUser = await model.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" })
        }

        const newUser = new model({ username, email, password, cPassword })
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
