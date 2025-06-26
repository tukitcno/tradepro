const express = require('express');
const { pool } = require('../models/database');
const { getCurrentPrice } = require('../services/priceEngine');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Place a trade (now supports fiat)
router.post('/place', authenticateToken, async (req, res) => {
  const { amount, direction, duration, fiat, token } = req.body;
  // Validate Tradersx Token
  if (token !== process.env.TRADERSX_TOKEN) {
    return res.status(403).json({ message: 'Invalid trading token' });
  }
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
    
    // Deduct balance
    await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, req.user.id]);
    
    // Get entry price for fiat
    const entryPrice = getCurrentPrice(fiat);
    
    // Create trade
    const expiresAt = new Date(Date.now() + duration * 1000);
    const tradeResult = await client.query(`
      INSERT INTO trades (user_id, amount, direction, duration, entry_price, expires_at, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *
    `, [req.user.id, amount, direction, duration, entryPrice, expiresAt]);
    
    await client.query('COMMIT');
    
    // Schedule trade resolution
    setTimeout(() => resolveTrade(tradeResult.rows[0].id, fiat), duration * 1000);
    
    res.json({ success: true, trade: tradeResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Failed to place trade' });
  } finally {
    client.release();
  }
});

// Get user trades
router.get('/my-trades', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM trades WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50
    `, [req.user.id]);
    
    res.json({ trades: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Resolve trade function (now uses real price for fiat)
async function resolveTrade(tradeId, fiat) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const tradeResult = await client.query('SELECT * FROM trades WHERE id = $1', [tradeId]);
    const trade = tradeResult.rows[0];
    
    if (!trade || trade.status !== 'pending') return;
    
    // Get current price for fiat
    const exitPrice = getCurrentPrice(fiat);
    const won = (trade.direction === 'up' && exitPrice > trade.entry_price) ||
                (trade.direction === 'down' && exitPrice < trade.entry_price);
    
    let payout = 0;
    if (won) {
      payout = trade.amount * 1.8; // 80% profit
      await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [payout, trade.user_id]);
    }
    
    await client.query(`
      UPDATE trades SET status = $1, exit_price = $2, payout = $3 WHERE id = $4
    `, [won ? 'won' : 'lost', exitPrice, payout, tradeId]);
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Trade resolution error:', error);
  } finally {
    client.release();
  }
}

module.exports = router;