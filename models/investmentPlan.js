const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  dailyReturn: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalReturn: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

const InvestmentPlan = mongoose.model('InvestmentPlan', investmentPlanSchema);

// Seed function to add all your defined investment plans
async function seedInvestmentPlans() {
    const plans = [
      { name: "Starter", amount: 600, dailyReturn: 120, duration: 20, totalReturn: 2400 },
      { name: "Basic", amount: 1000, dailyReturn: 250, duration: 24, totalReturn: 6000 },
      { name: "Standard", amount: 1500, dailyReturn: 400, duration: 28, totalReturn: 11200 },
      { name: "Bronze", amount: 2000, dailyReturn: 600, duration: 32, totalReturn: 19200 },
      { name: "Silver", amount: 3000, dailyReturn: 850, duration: 36, totalReturn: 30600 },
      { name: "Gold", amount: 5000, dailyReturn: 1000, duration: 40, totalReturn: 40000 },
      { name: "Platinum", amount: 10000, dailyReturn: 2500, duration: 44, totalReturn: 110000 },
      { name: "Diamond", amount: 15000, dailyReturn: 4000, duration: 48, totalReturn: 192000 },
      { name: "Premium", amount: 20000, dailyReturn: 6000, duration: 52, totalReturn: 312000 },
      { name: "Elite", amount: 30000, dailyReturn: 9000, duration: 56, totalReturn: 504000 },
      { name: "Executive", amount: 40000, dailyReturn: 12500, duration: 60, totalReturn: 750000 },
      { name: "VIP", amount: 50000, dailyReturn: 16000, duration: 64, totalReturn: 1024000 }
    ];
  
    try {
      // Always delete existing plans and add new ones
      console.log("Removing existing investment plans...");
      await InvestmentPlan.deleteMany({});
      console.log("Adding new investment plans...");
      await InvestmentPlan.insertMany(plans);
      console.log('Investment plans seeded successfully');
    } catch (error) {
      console.error('Error seeding investment plans:', error);
    }
  }

module.exports = { InvestmentPlan, seedInvestmentPlans };