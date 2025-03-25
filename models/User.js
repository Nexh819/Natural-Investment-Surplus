const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Import JWT library

// User schema definition
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       // User's name
  email: { type: String, required: true, unique: true }, // User's email (unique)
  password: { type: String, required: true },    // User's password
  balance: { type: Number, default: 0 },         // User's balance (default is 0)
  referralCode: { type: String, unique: true },  // Unique referral code for the user
  referredBy: { type: String },                  // Who referred the user (optional)
});

// Automatically generate referral code when a new user is created
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Generate a referral code (random string of 8 characters)
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 10); // Random code generation
  }

  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate JWT (JSON Web Token)
userSchema.methods.generateAuthToken = function() {
  // Ensure the secret key is loaded from environment variables
  const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '24h' });
  return token; // Return the token
};

// Method to verify JWT
userSchema.statics.verifyAuthToken = function(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    return decoded;  // Return the decoded data if the token is valid
  } catch (error) {
    throw new Error('Invalid token');  // Throw an error if the token is invalid
  }
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
