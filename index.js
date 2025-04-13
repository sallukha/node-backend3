const express = require("express");
const cors = require("cors");
const app = express();

require('./db/config');
const model = require("./model/user_modal");

app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:3000', 'https://transcendent-heliotrope-ea0403.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight support

const port = 4000;

// Routes
app.post("/login", async (req, res) => {
  // ...
});

app.post("/signup", async (req, res) => {
  // ...
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
