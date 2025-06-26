import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [loading, setLoading] = useState(false);
  const { login, loginWithPassword, sendOTP } = useAuth();
  const navigate = useNavigate();

  const detectInputType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    
    if (emailRegex.test(input)) return 'email';
    if (phoneRegex.test(input.replace(/\s/g, ''))) return 'phone';
    return 'unknown';
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your phone number or email');
      return;
    }

    const inputType = detectInputType(identifier);
    if (inputType === 'unknown') {
      toast.error('Please enter a valid phone number or email address');
      return;
    }

    setLoading(true);
    const result = await sendOTP(identifier);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } else {
      toast.error(result.error);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error('Please enter both email/phone and password');
      return;
    }

    setLoading(true);
    const result = await loginWithPassword(identifier, password);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    const result = await login(identifier, otp);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Tradex</h1>
          <p className="text-gray-600">Professional Trading Platform</p>
          
          <div className="flex bg-gray-100 rounded-lg p-1 mt-4">
            <button
              onClick={() => setLoginMode('password')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'password' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMode('otp')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMode === 'otp' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
              }`}
            >
              OTP
            </button>
          </div>
        </div>

        {loginMode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center text-sm text-gray-600">
              <p>Demo Accounts:</p>
              <p>Admin: admin@tradex.com / admin321</p>
              <p>User: demo@tradex.com / user321</p>
            </div>
          </form>
        ) : !otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your phone or email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll automatically detect if it's a phone number or email
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-center text-lg tracking-widest"
                maxLength="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to {identifier}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp('');
              }}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to enter phone/email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;