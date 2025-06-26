# Tradex - Web Trading Platform

A complete trading platform similar to Binomo/Quotex with real-time trading, wallet management, referral system, and admin panel.

## 🚀 Features

- **Authentication**: Phone/Email login with OTP verification
- **Real-time Trading**: Up/Down binary options with live price feed
- **Wallet System**: Deposit/withdraw with transaction history
- **Referral Program**: Earn 10% commission on referrals
- **Admin Panel**: User management, trade monitoring, settings
- **WebSocket**: Real-time price updates and notifications

## 🛠️ Tech Stack

### Frontend
- React.js with Tailwind CSS
- Socket.IO client for real-time updates
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express
- PostgreSQL database
- Socket.IO for WebSocket connections
- JWT authentication
- Redis for caching (optional)

## 📦 Installation

### Prerequisites
- Node.js 16+
- PostgreSQL database
- Redis (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://username:password@host:port/database
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
REACT_APP_API_URL=https://your-backend-domain.render.com
```

5. Build for production:
```bash
npm run build
```

## 🚀 Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variables in Vercel dashboard
6. Deploy

## 🔐 Environment Variables

### Backend (.env)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Frontend domain for CORS

### Frontend (.env.local)
- `REACT_APP_API_URL`: Backend API URL

## 📱 Usage

### User Features
1. **Login**: Enter phone/email → Receive OTP (123456 for demo) → Login
2. **Trading**: Select amount and duration → Choose UP/DOWN → Wait for result
3. **Wallet**: Deposit/withdraw funds (demo mode)
4. **Referrals**: Share referral code and earn commissions

### Admin Features
1. **User Management**: View/edit user balances and KYC status
2. **Trade Monitoring**: View all trades with filters
3. **Settings**: Configure commission rates
4. **Statistics**: Platform overview and metrics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/login` - Login with OTP
- `GET /api/auth/me` - Get current user

### Trading
- `POST /api/trades/place` - Place a trade
- `GET /api/trades/my-trades` - Get user trades

### Wallet
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Get transactions

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/trades` - Get all trades
- `PUT /api/admin/settings` - Update settings

## 🎯 Demo Credentials

- **OTP**: Use `123456` for any phone/email
- **Admin Access**: Create user with role 'admin' in database
- **Initial Balance**: $1000 for new users

## 🔒 Security Features

- JWT authentication with 7-day expiry
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- SQL injection protection with parameterized queries

## 📊 Database Schema

### Users Table
- id, email, phone, balance, role, kyc_status
- referral_code, referred_by, created_at

### Trades Table
- id, user_id, amount, direction, duration
- entry_price, exit_price, status, payout

### Transactions Table
- id, user_id, type, amount, status, created_at

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.