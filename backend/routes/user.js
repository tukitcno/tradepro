const express = require('express');
const { pool } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    res.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      balance: parseFloat(user.balance),
      kycStatus: user.kyc_status,
      referralCode: user.referral_code
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;