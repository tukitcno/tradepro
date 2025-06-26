import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Wallet = () => {
  const { API_URL } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [profileRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/api/user/profile`),
        axios.get(`${API_URL}/api/wallet/transactions`)
      ]);
      
      setBalance(profileRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/wallet/deposit`, {
        amount: parseFloat(depositAmount)
      });

      if (response.data.success) {
        toast.success('Deposit request submitted successfully!');
        setDepositAmount('');
        fetchWalletData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/wallet/withdraw`, {
        amount: parseFloat(withdrawAmount)
      });

      if (response.data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setWithdrawAmount('');
        fetchWalletData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-accent';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-danger';
      default: return 'text-gray-500';
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-r from-accent to-green-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Account Balance</h2>
            <div className="text-5xl font-bold">${balance.toFixed(2)}</div>
            <p className="text-green-100 mt-2">Available for trading</p>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-accent">💰 Deposit Funds</h3>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Deposit'}
            </button>
            <p className="text-xs text-gray-500">
              * This is a demo. No real money will be processed.
            </p>
          </form>
        </div>

        {/* Withdraw Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-danger">💸 Withdraw Funds</h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={balance}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-danger focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-danger hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
            <p className="text-xs text-gray-500">
              Available: ${balance.toFixed(2)}
            </p>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setDepositAmount('50')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Deposit $50
            </button>
            <button
              onClick={() => setDepositAmount('100')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Deposit $100
            </button>
            <button
              onClick={() => setDepositAmount('500')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Deposit $500
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📊 Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`capitalize ${
                          transaction.type === 'deposit' ? 'text-accent' : 'text-danger'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`capitalize font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;