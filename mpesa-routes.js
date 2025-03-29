const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');
const { auth } = require('../middleware/auth'); // Your authentication middleware

// Environment variables (store these in .env file)
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const PASSKEY = process.env.MPESA_PASSKEY;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'

// Base URLs
const BASE_URL = ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

// Store transactions temporarily (use a database in production)
const transactions = {};

// Get OAuth token
async function getAccessToken() {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(
            `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
    }
}

// Initiate STK Push
router.post('/stkpush', auth, async (req, res) => {
    try {
        const { phoneNumber, amount, accountReference } = req.body;
        
        // Validate input
        if (!phoneNumber || !amount) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number and amount are required' 
            });
        }
        
        // Format amount to whole number
        const formattedAmount = Math.floor(parseFloat(amount));
        if (formattedAmount < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Amount must be at least 1 KSh' 
            });
        }
        
        // Get access token
        const accessToken = await getAccessToken();
        
        // Generate timestamp
        const timestamp = moment().format('YYYYMMDDHHmmss');
        
        // Generate password
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
        
        // Prepare STK Push request
        const data = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: formattedAmount,
            PartyA: phoneNumber,
            PartyB: SHORTCODE,
            PhoneNumber: phoneNumber,
            CallBackURL: CALLBACK_URL,
            AccountReference: accountReference || 'Natural Surplus',
            TransactionDesc: 'Investment Payment'
        };
        
        // Send STK Push request
        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpush/v1/processrequest`, 
            data, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Store transaction for status check
        const checkoutRequestID = response.data.CheckoutRequestID;
        transactions[checkoutRequestID] = {
            status: 'PENDING',
            phoneNumber,
            amount: formattedAmount,
            timestamp: new Date(),
            userId: req.user.id // Assuming req.user is set by authentication middleware
        };
        
        res.status(200).json({
            success: true,
            message: 'STK Push initiated successfully',
            checkoutRequestID
        });
    } catch (error) {
        console.error('Error initiating STK Push:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate M-PESA payment'
        });
    }
});

// Check payment status
router.get('/status/:checkoutRequestID', auth, (req, res) => {
    const { checkoutRequestID } = req.params;
    const transaction = transactions[checkoutRequestID];
    
    if (!transaction) {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
    }
    
    res.status(200).json({
        success: true,
        status: transaction.status,
        message: transaction.message
    });
});

// Query STK transaction status directly from Safaricom
router.post('/query-status', auth, async (req, res) => {
    try {
        const { checkoutRequestID } = req.body;
        
        if (!checkoutRequestID) {
            return res.status(400).json({
                success: false,
                message: 'CheckoutRequestID is required'
            });
        }
        
        // Get access token
        const accessToken = await getAccessToken();
        
        // Generate timestamp
        const timestamp = moment().format('YYYYMMDDHHmmss');
        
        // Generate password
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
        
        // Prepare status query request
        const data = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestID
        };
        
        // Query status
        const response = await axios.post(
            `${BASE_URL}/mpesa/stkpushquery/v1/query`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const resultCode = response.data.ResultCode;
        const resultDesc = response.data.ResultDesc;
        
        if (resultCode === "0") {
            // Update transaction status
            if (transactions[checkoutRequestID]) {
                transactions[checkoutRequestID].status = 'COMPLETED';
                transactions[checkoutRequestID].message = resultDesc;
            }
            
            res.status(200).json({
                success: true,
                status: 'COMPLETED',
                message: resultDesc
            });
        } else {
            // Update transaction status
            if (transactions[checkoutRequestID]) {
                transactions[checkoutRequestID].status = 'FAILED';
                transactions[checkoutRequestID].message = resultDesc;
            }
            
            res.status(200).json({
                success: false,
                status: 'FAILED',
                message: resultDesc
            });
        }
    } catch (error) {
        console.error('Error querying STK status:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to query payment status'
        });
    }
});

// M-PESA callback
router.post('/callback', (req, res) => {
    // Respond to Safaricom immediately
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
    
    // Process callback data
    const callbackData = req.body;
    
    // Verify callback data
    if (!callbackData || !callbackData.Body || !callbackData.Body.stkCallback) {
        console.error('Invalid callback data received');
        return;
    }
    
    const result = callbackData.Body.stkCallback;
    const checkoutRequestID = result.CheckoutRequestID;
    
    if (!transactions[checkoutRequestID]) {
        console.error('Transaction not found for checkout request ID:', checkoutRequestID);
        return;
    }
    
    if (result.ResultCode === 0) {
        // Payment successful
        const transaction = transactions[checkoutRequestID];
        transaction.status = 'COMPLETED';
        transaction.resultCode = result.ResultCode;
        transaction.resultDesc = result.ResultDesc;
        
        // Here you would update the user's account balance in your database
        // For example:
        /*
        const User = require('../models/User');
        User.findByIdAndUpdate(
            transaction.userId, 
            { $inc: { balance: transaction.amount } },
            { new: true }
        ).then(updatedUser => {
            console.log('User balance updated:', updatedUser.balance);
        }).catch(err => {
            console.error('Error updating user balance:', err);
        });
        */
        
        console.log('Payment successful:', checkoutRequestID);
    } else {
        // Payment failed
        transactions[checkoutRequestID].status = 'FAILED';
        transactions[checkoutRequestID].message = result.ResultDesc;
        console.log('Payment failed:', checkoutRequestID, result.ResultDesc);
    }
});

module.exports = router;