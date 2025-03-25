const mongoose = require('mongoose');

// Define the Investment schema
const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan' }, // Reference to the plan
  planName: { type: String }, // Store the plan name for easier reference
  amount: { type: Number, required: true },       // Amount the user invested
  dailyReturn: { type: Number, required: true },  // The daily return on the investment
  duration: { type: Number, required: true },     // Duration in days
  totalReturn: { type: Number, required: true },  // Total expected return
  startDate: { type: Date, default: Date.now },   // When the investment started
  endDate: { type: Date },                        // When the investment ends
  status: { 
    type: String, 
    enum: ['active', 'completed', 'terminated'],
    default: 'active'
  },
  lastPayoutDate: { type: Date },                 // Track the last day return was paid
  returnsCollected: { type: Number, default: 0 }, // Total amount collected so far
  daysCollected: { type: Number, default: 0 },    // Number of days collected
});

// Calculate end date before saving
investmentSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set the end date based on start date + duration
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + this.duration);
    this.endDate = endDate;
    
    // Initialize lastPayoutDate
    this.lastPayoutDate = new Date(this.startDate);
    this.lastPayoutDate.setDate(this.lastPayoutDate.getDate() - 1); // One day before start
  }
  next();
});

// Instance method to check if the investment is due for payout
investmentSchema.methods.canCollectDailyReturn = function(currentDate = new Date()) {
  if (this.status !== 'active') return false;
  
  // If we've already collected for all days
  if (this.daysCollected >= this.duration) return false;
  
  const lastPayout = new Date(this.lastPayoutDate);
  const nextPayoutDate = new Date(lastPayout);
  nextPayoutDate.setDate(nextPayoutDate.getDate() + 1);
  
  // Check if the current date is on or after the next payout date
  return currentDate >= nextPayoutDate;
};

// Instance method to collect daily return
investmentSchema.methods.collectDailyReturn = async function() {
  if (!this.canCollectDailyReturn()) return null;
  
  // Calculate how many days can be collected (max 1 for daily)
  const daysToCollect = 1;
  const amountToCollect = this.dailyReturn * daysToCollect;
  
  // Update investment record
  this.returnsCollected += amountToCollect;
  this.daysCollected += daysToCollect;
  this.lastPayoutDate = new Date(); // Set to current date
  
  // Check if investment is completed
  if (this.daysCollected >= this.duration) {
    this.status = 'completed';
  }
  
  await this.save();
  
  // Return the collected amount
  return {
    amount: amountToCollect,
    date: new Date(),
    daysCollected: daysToCollect
  };
};

// Static method to find investments due for payout
investmentSchema.statics.findDuePayouts = function() {
  const currentDate = new Date();
  return this.find({
    status: 'active',
    daysCollected: { $lt: '$duration' },
    lastPayoutDate: { $lt: currentDate }
  }).populate('userId');
};

// Create the Investment model
const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;