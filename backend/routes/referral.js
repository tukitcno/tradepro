const express = require('express');
const { pool } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get referral stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const referralsResult = await pool.query(`
      SELECT u.*, COALESCE(SUM(t.payout * 0.1), 0) as total_commission
      FROM users u
      LEFT JOIN trades t ON u.id = t.user_id AND t.status = 'won'
      WHERE u.referred_by = $1
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `, [req.user.id]);
    
    const totalEarnings = referralsResult.rows.reduce((sum, ref) => 
      sum + parseFloat(ref.total_commission || 0), 0
    );
    
    res.json({
      code: req.user.referral_code,
      totalReferrals: referralsResult.rows.length,
      totalEarnings,
      referrals: referralsResult.rows.map(ref => ({
        id: ref.id,
        email: ref.email,
        phone: ref.phone,
        createdAt: ref.created_at,
        isActive: true,
        totalCommission: parseFloat(ref.total_commission || 0)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch referral stats' });
  }
});

module.exports = router;