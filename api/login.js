const dbConnect = require('../db/config');
const User = require('../model/user_modal');

module.exports = async (req, res) => {
  console.log({req, res})
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  await dbConnect();
  const { email, password } = req.body;

  console.log({email, password})

  try {
    const user = await User.findOne({ email, password });
    consle.log({user})
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    } d

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
