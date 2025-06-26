const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Generate random referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Send OTP (simulated)
router.post('/send-otp', async (req, res) => {
  const { identifier } = req.body;
  
  try {
    // In production, integrate with SMS/Email service
    console.log(`OTP for ${identifier}: 123456`);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Login with OTP
router.post('/login', async (req, res) => {
  const { identifier, otp } = req.body;
  
  try {
    // Simulate OTP verification (in production, verify against stored OTP)
    if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier);
    
    // Check if user exists
    const userQuery = isEmail 
      ? 'SELECT * FROM users WHERE email = $1'
      : 'SELECT * FROM users WHERE phone = $1';
    
    let result = await pool.query(userQuery, [identifier]);
    let user = result.rows[0];

    // Create user if doesn't exist
    if (!user) {
      const referralCode = generateReferralCode();
      const insertQuery = isEmail
        ? 'INSERT INTO users (email, referral_code) VALUES ($1, $2) RETURNING *'
        : 'INSERT INTO users (phone, referral_code) VALUES ($1, $2) RETURNING *';
      
      result = await pool.query(insertQuery, [identifier, referralCode]);
      user = result.rows[0];
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: parseFloat(user.balance)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      balance: parseFloat(req.user.balance)
    }
  });
});

module.exports = router;