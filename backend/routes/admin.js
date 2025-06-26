const express = require('express');
const { pool } = require('../models/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update user balance
router.put('/users/:id/balance', authenticateToken, requireAdmin, async (req, res) => {
  const { balance } = req.body;
  const { id } = req.params;
  
  try {
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [balance, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update balance' });
  }
});

// Update KYC status
router.put('/users/:id/kyc', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  try {
    await pool.query('UPDATE users SET kyc_status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update KYC status' });
  }
});

// Get all trades
router.get('/trades', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.email, u.phone 
      FROM trades t 
      LEFT JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    
    const trades = result.rows.map(trade => ({
      ...trade,
      user: { email: trade.email, phone: trade.phone }
    }));
    
    res.json({ trades });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Get settings
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json({ settings: { commissionRate: parseFloat(settings.commission_rate || 10) } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  const { commissionRate } = req.body;
  
  try {
    await pool.query(`
      INSERT INTO settings (key, value) VALUES ('commission_rate', $1)
      ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP
    `, [commissionRate]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;