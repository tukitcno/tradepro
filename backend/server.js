const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tradeRoutes = require('./routes/trades');
const walletRoutes = require('./routes/wallet');
const referralRoutes = require('./routes/referral');
const adminRoutes = require('./routes/admin');
const { initDatabase } = require('./models/database');
const { startPriceEngine } = require('./services/priceEngine');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
const TRADERSX_TOKEN = process.env.TRADERSX_TOKEN;
const LIVE_TRADING_ROOM = 'live-trading';

io.on('connection', (socket) => {
  // Expect token as a query param or via auth event
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (token === TRADERSX_TOKEN) {
    socket.join(LIVE_TRADING_ROOM);
    console.log('User joined live-trading room:', socket.id);
    socket.emit('authSuccess', { message: 'Live trading access granted.' });
  } else {
    console.log('User failed live trading auth:', socket.id);
    socket.emit('authError', { message: 'Invalid Tradersx Token.' });
    // Optionally disconnect: socket.disconnect();
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  let retries = 5;
  
  while (retries > 0) {
    try {
      await initDatabase();
      console.log('Database initialized successfully');
      
      // Start price engine
      startPriceEngine(io, LIVE_TRADING_ROOM);
      console.log('Price engine started');
      
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
      return;
    } catch (error) {
      console.error(`Database connection failed. Retries left: ${retries - 1}`, error.message);
      retries--;
      if (retries === 0) {
        console.error('Failed to start server after all retries');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

startServer();

module.exports = { app, io };