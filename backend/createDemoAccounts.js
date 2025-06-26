const { pool } = require('./models/database');
const bcrypt = require('bcryptjs');

const createDemoAccounts = async () => {
  const client = await pool.connect();
  try {
    console.log('Creating demo accounts...');
    
    // Hash passwords
    const adminHash = await bcrypt.hash('admin321', 10);
    const userHash = await bcrypt.hash('user321', 10);
    
    // Delete existing demo accounts if they exist
    await client.query('DELETE FROM users WHERE email IN ($1, $2)', ['admin@tradex.com', 'demo@tradex.com']);
    
    // Create demo accounts
    await client.query(`
      INSERT INTO users (email, phone, password, balance, role, kyc_status, referral_code)
      VALUES 
        ('admin@tradex.com', '+1987654321', $1, 5000.00, 'admin', 'approved', 'ADMIN1'),
        ('demo@tradex.com', '+1234567890', $2, 1000.00, 'user', 'approved', 'DEMO01')
    `, [adminHash, userHash]);
    
    console.log('Demo accounts created successfully!');
    console.log('Admin: admin@tradex.com / admin321');
    console.log('User: demo@tradex.com / user321');
    
    // Verify accounts
    const result = await client.query('SELECT email, role, balance FROM users WHERE email IN ($1, $2)', ['admin@tradex.com', 'demo@tradex.com']);
    console.log('Verification:', result.rows);
    
  } catch (error) {
    console.error('Error creating demo accounts:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

createDemoAccounts();