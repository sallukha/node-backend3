const dbConnect = require('../db/config');
const User = require('../model/user_model');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  await dbConnect();
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ fullname, email, password,  });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'Signup successful', user: savedUser });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};
