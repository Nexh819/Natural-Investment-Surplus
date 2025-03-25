const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Import JWT library
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors'); // Import CORS

// Add these new imports
const { InvestmentPlan, seedInvestmentPlans } = require('./models/investmentPlan');
const Investment = require('./models/Investment'); // Keep using your existing Investment model path
const User = require('./models/User');

const app = express();
const port = 4000;  // Changed port number from 3000 to 4000

// MongoDB connection
const mongoURI = process.env.MONGO_URI;  // This will get the MongoDB URI from .env file
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed investment plans
    return seedInvestmentPlans();
  })
  .then(() => {
    console.log('Investment plans seeded or verified');
    // Set up daily payouts
    setUpDailyPayouts();
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Middleware to handle JSON requests
app.use(express.json());

// Enable CORS to allow cross-origin requests
app.use(cors()); // This line enables CORS for all incoming requests

// Middleware to serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Simple route to check the server is working
app.get('/', (req, res) => {
  res.send('Welcome to Natural Surplus Investment Plans!');
});

// Updated route to get all investment plans from the database
app.get('/investment-plans', async (req, res) => {
  try {
    // Try to get plans from the database first
    const dbPlans = await InvestmentPlan.find({ active: true });
    
    // If we have plans in the database, return those
    if (dbPlans && dbPlans.length > 0) {
      return res.json(dbPlans);
    }
    
    // Fallback to hardcoded plans if database is empty
    const plans = [
      { amount: 600, dailyReturn: 120, duration: "20 days" },
      { amount: 1000, dailyReturn: 250, duration: "24 days" },
      { amount: 1500, dailyReturn: 400, duration: "28 days" },
      { amount: 2000, dailyReturn: 600, duration: "32 days" },
      { amount: 3000, dailyReturn: 850, duration: "1 month, 6 days" },
      { amount: 5000, dailyReturn: 1000, duration: "1 month, 10 days" },
      { amount: 10000, dailyReturn: 2500, duration: "1 month, 14 days" },
      { amount: 15000, dailyReturn: 4000, duration: "1 month, 18 days" },
      { amount: 20000, dailyReturn: 6000, duration: "1 month, 22 days" },
    ];

    res.json(plans);
  } catch (error) {
    console.error('Error fetching investment plans:', error);
    res.status(500).json({ message: 'Server error fetching plans' });
  }
});

// Route for user registration (Sign Up)
app.post('/register', async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    // If referral code is provided, find the user who referred the new user
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer.referralCode;  // Store the referrer's referral code
      } else {
        return res.status(400).json({ message: 'Invalid referral code!' });
      }
    }

    // Generate referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 15); // Unique referral code

    // Create a new user
    const newUser = new User({
      name,
      email,
      password,
      referralCode: newReferralCode,
      referredBy // Set the referredBy field to the referrer's referral code
    });

    // Save the new user to the database
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADDED: New route for frontend compatibility
app.post('/auth/register', async (req, res) => {
  const { name, username, email, phone, password, referralCode } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { name: username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use!' });
    }

    // If referral code is provided, find the user who referred the new user
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer.referralCode;  // Store the referrer's referral code
      } else {
        return res.status(400).json({ message: 'Invalid referral code!' });
      }
    }

    // Generate referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 15); // Unique referral code

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      phone: phone,
      referralCode: newReferralCode,
      referredBy: referredBy // Set the referredBy field to the referrer's referral code
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,  // Using the JWT_SECRET from the environment
      { expiresIn: '24h' }
    );
    
    // Prepare user data for response
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      username: username,
      email: newUser.email,
      phone: phone,
      referralCode: newUser.referralCode,
      referredBy: newUser.referredBy,
      balance: 0
    };
    
    res.status(201).json({ 
      message: 'User registered successfully!',
      token: token,
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route for user login (Authentication)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    // Compare the entered password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT token after successful login
    const token = user.generateAuthToken(); // Generate the token

    res.status(200).json({
      message: 'Login successful!',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADDED: New route for frontend compatibility
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ name: username }, { email: username }]
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Using the JWT_SECRET from the environment
      { expiresIn: '24h' }
    );

    // Prepare user data for response
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.name, // Using name as username
      email: user.email,
      phone: user.phone || '',
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      balance: user.balance || 0
    };

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Updated route to create an investment using plans
app.post('/invest', async (req, res) => {
  const { userId, planId } = req.body;

  try {
    // Check if we have both userId and either planId or the original fields
    if (!userId || (!planId && !(req.body.amount && req.body.dailyReturn && req.body.duration))) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let amount, dailyReturn, duration, endDate, planName, totalReturn;

    // If planId is provided, use the investment plan
    if (planId) {
      const plan = await InvestmentPlan.findById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Investment plan not found' });
      }

      // Check if user has enough balance
      if (user.balance < plan.amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      amount = plan.amount;
      dailyReturn = plan.dailyReturn;
      duration = plan.duration;
      planName = plan.name;
      totalReturn = plan.totalReturn;
    } else {
      // Use the provided fields (backward compatibility)
      amount = req.body.amount;
      dailyReturn = req.body.dailyReturn;
      duration = req.body.duration;
      totalReturn = dailyReturn * duration;
    }

    // Calculate the end date
    endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    // Create a new investment
    const newInvestment = new Investment({
      userId,
      planId: planId || null,
      planName: planName || 'Custom Plan',
      amount,
      dailyReturn,
      duration,
      totalReturn: totalReturn || (dailyReturn * duration),
      endDate
    });

    // Save the investment to the database
    await newInvestment.save();

    // Update the user's balance
    // Note: In your original code, you're adding to balance, which seems counterintuitive
    // for an investment. Typically you'd subtract from balance when investing.
    // I'll maintain your logic, but you may want to review this.
    user.balance += amount; // Add the investment amount to the user's balance
    await user.save();

    // Process referral bonuses with updated commission rates
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer) {
        // Level 1: Direct referrer gets 18% (updated from 3%)
        const level1Commission = amount * 0.18;
        referrer.balance += level1Commission;
        await referrer.save();
        
        // Level 2: Second level referrer gets 5% (updated from 2%)
        if (referrer.referredBy) {
          const level2Referrer = await User.findOne({ referralCode: referrer.referredBy });
          if (level2Referrer) {
            const level2Commission = amount * 0.05;
            level2Referrer.balance += level2Commission;
            await level2Referrer.save();
            
            // Level 3: Third level referrer gets 2% (updated from 1%)
            if (level2Referrer.referredBy) {
              const level3Referrer = await User.findOne({ referralCode: level2Referrer.referredBy });
              if (level3Referrer) {
                const level3Commission = amount * 0.02;
                level3Referrer.balance += level3Commission;
                await level3Referrer.save();
              }
            }
          }
        }
      }
    }

    res.status(201).json({ 
      message: 'Investment created successfully!', 
      investment: newInvestment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enhanced user dashboard route
app.get('/user/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's investments
    const investments = await Investment.find({ userId });
    
    // Calculate statistics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // Find direct referrals
    const directReferrals = await User.find({ referredBy: user.referralCode });
    
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.name,
      email: user.email,
      phone: user.phone || '',
      balance: user.balance || 0,
      referralCode: user.referralCode,
      referredBy: user.referredBy
    };
    
    res.json({
      user: userData,
      investments: investments,
      referrals: directReferrals.map(ref => ({
        username: ref.name,
        email: ref.email
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Keeping the original dashboard route for backward compatibility
app.get('/user/dashboard', async (req, res) => {
  try {
    // In a real application, we would extract the user ID from the JWT token
    // For now, we'll return dummy data for testing
    
    res.json({
      user: {
        name: "Test User",
        username: "testuser",
        balance: 5000,
        referralCode: "TEST123",
        referredBy: null
      },
      investments: [
        {
          amount: 1000,
          dailyReturn: 250,
          duration: "24 days",
          startDate: new Date(),
          endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000)
        }
      ],
      referrals: [
        {
          username: "referreduser1",
          commission: 100
        }
      ]
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new route for getting user investments
app.get('/user/investments/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const investments = await Investment.find({ userId })
      .populate('planId');
    
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Function to handle daily investment payouts
function setUpDailyPayouts() {
  // You can use a proper cron library in production
  // This is a simple demonstration that runs once per day
  
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  async function processPayouts() {
    try {
      console.log('Processing daily investment returns...');
      
      // Find active investments that need processing
      const currentDate = new Date();
      const investments = await Investment.find({
        endDate: { $gte: currentDate } // Only process investments that haven't ended
      });
      
      console.log(`Found ${investments.length} active investments to process`);
      
      for (const investment of investments) {
        // Check if we should pay out today
        const investmentStartDate = new Date(investment.startDate);
        const daysSinceStart = Math.floor((currentDate - investmentStartDate) / (24 * 60 * 60 * 1000));
        
        // If investment has started and hasn't reached the end date
        if (daysSinceStart >= 0 && currentDate <= investment.endDate) {
          // Add daily return to user balance
          await User.findByIdAndUpdate(
            investment.userId,
            { $inc: { balance: investment.dailyReturn } }
          );
          
          console.log(`Paid ${investment.dailyReturn} to user ${investment.userId} for investment ${investment._id}`);
        }
      }
    } catch (error) {
      console.error('Error processing investment payouts:', error);
    }
    
    // Schedule the next run
    setTimeout(processPayouts, TWENTY_FOUR_HOURS);
  }
  
  // Initial run (starts 1 second after server starts)
  setTimeout(processPayouts, 1000);
}

// Start the server
// Temporary endpoint to reset investment plans
app.get('/reset-plans', async (req, res) => {
  try {
    const { InvestmentPlan } = require('./models/investmentPlan');
    await InvestmentPlan.deleteMany({});
    await seedInvestmentPlans();
    res.send('Investment plans reset successfully');
  } catch (error) {
    res.status(500).send('Error resetting plans: ' + error.message);
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});