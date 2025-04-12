const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  confirmPassword: String
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
