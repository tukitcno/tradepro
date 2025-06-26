import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(1.2345);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [tradeTime, setTradeTime] = useState(60);
  const [activeTimer, setActiveTimer] = useState(null);
  const [trades, setTrades] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchTrades();
    
    const newSocket = io(API_URL);
    setSocket(newSocket);
    
    newSocket.on('priceUpdate', (data) => {
      setCurrentPrice(data.price);
    });

    return () => newSocket.close();
  }, [API_URL]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/api/user/profile`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTrades = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/api/trades/my-trades`);
      setTrades(response.data.trades);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const placeTrade = async (direction) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (tradeAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/trades/place`, {
        amount: tradeAmount,
        direction,
        duration: tradeTime,
        entryPrice: currentPrice
      });

      if (response.data.success) {
        toast.success(`${direction.toUpperCase()} trade placed!`);
        setActiveTimer(tradeTime);
        fetchUserData();
        fetchTrades();
        
        // Start countdown
        const interval = setInterval(() => {
          setActiveTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              fetchUserData();
              fetchTrades();
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trade failed');
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">EUR/USD</h2>
              <div className="text-2xl font-mono font-bold text-accent">
                {currentPrice.toFixed(5)}
              </div>
            </div>
            <div className="trading-chart h-64 rounded-lg flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentPrice.toFixed(5)}</div>
                <div className="text-sm opacity-75">Live Price Feed</div>
              </div>
            </div>
          </div>

          {/* Trading Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Place Trade</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  min="1"
                  max={balance}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                <select
                  value={tradeTime}
                  onChange={(e) => setTradeTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={120}>2 minutes</option>
                </select>
              </div>
            </div>
            
            {activeTimer ? (
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-warning">
                  Trade Active: {activeTimer}s remaining
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => placeTrade('up')}
                  className="bg-accent hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  📈 UP
                </button>
                <button
                  onClick={() => placeTrade('down')}
                  className="bg-danger hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  📉 DOWN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Balance */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Account Balance</h3>
            {user ? (
              <div className="text-3xl font-bold text-accent">${balance.toFixed(2)}</div>
            ) : (
              <div className="text-center py-4">
                <div className="text-lg text-gray-500 mb-2">Login to view balance</div>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-accent text-white px-4 py-2 rounded-lg"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Recent Trades */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Recent Trades</h3>
            {user ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">${trade.amount}</div>
                      <div className="text-xs text-gray-500">
                        {trade.direction.toUpperCase()}
                      </div>
                    </div>
                    <div className={`font-bold ${
                      trade.status === 'won' ? 'text-accent' : 
                      trade.status === 'lost' ? 'text-danger' : 'text-warning'
                    }`}>
                      {trade.status === 'pending' ? 'Active' : 
                       trade.status === 'won' ? `+$${trade.payout?.toFixed(2)}` : 
                       `-$${trade.amount}`}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Login to view your trades</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;