import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import LiveChart from '../components/LiveChart';
import TradingSignals from '../components/TradingSignals';

const Dashboard = () => {
  const { user, API_URL, TRADERSX_TOKEN } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(1.2345);
  const [tradeAmount, setTradeAmount] = useState(10);
  const [tradeTime, setTradeTime] = useState(60);
  const [activeTimer, setActiveTimer] = useState(null);
  const [trades, setTrades] = useState([]);
  const [socket, setSocket] = useState(null);
  const [lastTradeResult, setLastTradeResult] = useState(null);

  const signalPairs = [
    { pair: 'USD/ARS (OTC)', duration: 15, time: '03:57:56' },
    { pair: 'NZD/JPY (OTC)', duration: 10, time: '03:57:56' },
    { pair: 'Pfizer Inc (OTC)', duration: 15, time: '03:57:56' },
    { pair: 'Gold', duration: 15, time: '03:57:56' },
    { pair: 'USD/TRY (OTC)', duration: 30, time: '03:57:56' },
    { pair: 'Intel (OTC)', duration: 10, time: '03:57:56' },
    { pair: 'UKBrent (OTC)', duration: 15, time: '03:57:56' },
    { pair: 'CAD/JPY (OTC)', duration: 10, time: '03:57:56' },
    { pair: 'USD/CAD (OTC)', duration: 5, time: '03:57:56' },
    { pair: 'USD/EGP (OTC)', duration: 10, time: '03:57:56' },
    { pair: 'EUR/SGD (OTC)', duration: 3, time: '03:57:56' },
  ];
  const [selectedSignal, setSelectedSignal] = useState(signalPairs[0]);

  useEffect(() => {
    fetchUserData();
    fetchTrades();
    // Connect with token for live trading
    const newSocket = io(API_URL, { auth: { token: TRADERSX_TOKEN } });
    setSocket(newSocket);
    newSocket.on('priceUpdate', (data) => {
      setCurrentPrice(data.price);
    });
    return () => newSocket.close();
  }, [API_URL, TRADERSX_TOKEN]);

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
        entryPrice: currentPrice,
        token: TRADERSX_TOKEN
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

  // Pass trade handler to LiveChart
  const handleLiveChartTrade = async ({ amount, direction, duration, fiat }) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }
    try {
      const tradeRes = await axios.post(`${API_URL}/api/trades/place`, {
        amount,
        direction,
        duration,
        fiat,
        token: TRADERSX_TOKEN
      });
      if (tradeRes.data.success) {
        toast.success(`${direction.toUpperCase()} trade placed!`);
        setActiveTimer(duration);
        fetchUserData();
        fetchTrades();
        // Poll for trade result after expiry
        setTimeout(async () => {
          await fetchTrades();
          // Find the most recent trade for this user and fiat
          const latest = trades.find(t => t.fiat === fiat && t.status !== 'pending');
          if (latest) setLastTradeResult(latest);
        }, duration * 1000 + 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar: Trading Signals */}
        <div className="w-full lg:w-1/4">
          <TradingSignals signals={signalPairs} onSelect={setSelectedSignal} />
        </div>
        {/* Main Trading Area */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Live Chart */}
          <div className="bg-[#181c27] rounded-2xl shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Live Trading</h1>
            <LiveChart onTrade={handleLiveChartTrade} lastTradeResult={lastTradeResult} selectedSignal={selectedSignal} />
          </div>
          {/* Trading Controls & Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trading Controls */}
            <div className="bg-[#23273a] rounded-2xl shadow-lg p-6 flex flex-col gap-4 animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-2">Place Trade</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">Amount ($)</label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(Number(e.target.value))}
                    min="1"
                    max={balance}
                    className="w-full px-3 py-2 border border-[#23273a] rounded-lg focus:ring-2 focus:ring-accent bg-[#181c27] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-300">Duration (seconds)</label>
                  <select
                    value={tradeTime}
                    onChange={(e) => setTradeTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#23273a] rounded-lg focus:ring-2 focus:ring-accent bg-[#181c27] text-white"
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
            {/* Account Balance & Recent Trades */}
            <div className="flex flex-col gap-8">
              {/* Balance */}
              <div className="bg-[#23273a] rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-2">Account Balance</h3>
                {user ? (
                  <div className="text-3xl font-bold text-accent">${balance.toFixed(2)}</div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-lg text-gray-400 mb-2">Login to view balance</div>
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
              <div className="bg-[#23273a] rounded-2xl shadow-lg p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-4">Recent Trades</h3>
                {user ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {trades.slice(0, 5).map((trade) => (
                      <div key={trade.id} className="flex justify-between items-center p-2 bg-[#181c27] rounded">
                        <div>
                          <div className="font-medium text-white">${trade.amount}</div>
                          <div className="text-xs text-gray-400">
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
                  <div className="text-center py-8 text-gray-400">
                    <p>Login to view your trades</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;