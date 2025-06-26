const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/tradex',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20) UNIQUE,
        password VARCHAR(255),
        balance DECIMAL(10,2) DEFAULT 1000.00,
        role VARCHAR(20) DEFAULT 'user',
        kyc_status VARCHAR(20) DEFAULT 'pending',
        referral_code VARCHAR(10) UNIQUE,
        referred_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Trades table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount DECIMAL(10,2) NOT NULL,
        direction VARCHAR(10) NOT NULL,
        duration INTEGER NOT NULL,
        entry_price DECIMAL(10,5) NOT NULL,
        exit_price DECIMAL(10,5),
        status VARCHAR(20) DEFAULT 'pending',
        payout DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `);

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default settings
    await client.query(`
      INSERT INTO settings (key, value) VALUES ('commission_rate', '10')
      ON CONFLICT (key) DO NOTHING
    `);

    // Create demo accounts
    const bcrypt = require('bcryptjs');
    const adminHash = await bcrypt.hash('admin321', 10);
    const userHash = await bcrypt.hash('user321', 10);
    
    await client.query(`
      INSERT INTO users (email, phone, password, balance, role, kyc_status, referral_code)
      VALUES 
        ('admin@tradex.com', '+1987654321', $1, 5000.00, 'admin', 'approved', 'ADMIN1'),
        ('demo@tradex.com', '+1234567890', $2, 1000.00, 'user', 'approved', 'DEMO01')
      ON CONFLICT (email) DO NOTHING
    `, [adminHash, userHash]);

    console.log('Database tables initialized with demo accounts');
  } finally {
    client.release();
  }
};

module.exports = { pool, initDatabase };