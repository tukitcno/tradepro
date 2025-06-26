const express = require('express');
const { pool } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Deposit request
router.post('/deposit', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  
  try {
    // Create transaction record
    await pool.query(`
      INSERT INTO transactions (user_id, type, amount, status)
      VALUES ($1, 'deposit', $2, 'completed')
    `, [req.user.id, amount]);
    
    // Update balance (in production, this would be done after payment confirmation)
    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, req.user.id]);
    
    res.json({ success: true, message: 'Deposit completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deposit failed' });
  }
});

// Withdraw request
router.post('/withdraw', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check balance
    const userResult = await client.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    const balance = parseFloat(userResult.rows[0].balance);
    
    if (balance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Create transaction record
    await client.query(`
      INSERT INTO transactions (user_id, type, amount, status)
      VALUES ($1, 'withdraw', $2, 'pending')
    `, [req.user.id, amount]);
    
    // Deduct balance
    await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, req.user.id]);
    
    await client.query('COMMIT');
    res.json({ success: true, message: 'Withdrawal request submitted' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Withdrawal failed' });
  } finally {
    client.release();
  }
});

// Get transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50
    `, [req.user.id]);
    
    res.json({ transactions: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;