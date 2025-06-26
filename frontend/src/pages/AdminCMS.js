import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminCMS = () => {
  const { API_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [settings, setSettings] = useState({ commissionRate: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await axios.get(`${API_URL}/api/admin/users`);
        setUsers(response.data.users);
      } else if (activeTab === 'trades') {
        const response = await axios.get(`${API_URL}/api/admin/trades`);
        setTrades(response.data.trades);
      } else if (activeTab === 'settings') {
        const response = await axios.get(`${API_URL}/api/admin/settings`);
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = async (userId, newBalance) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${userId}/balance`, {
        balance: parseFloat(newBalance)
      });
      toast.success('Balance updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update balance');
    }
  };

  const updateKYCStatus = async (userId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${userId}/kyc`, { status });
      toast.success('KYC status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update KYC status');
    }
  };

  const updateCommissionRate = async () => {
    try {
      await axios.put(`${API_URL}/api/admin/settings`, {
        commissionRate: parseFloat(settings.commissionRate)
      });
      toast.success('Commission rate updated');
    } catch (error) {
      toast.error('Failed to update commission rate');
    }
  };

  const tabs = [
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'trades', label: '📊 Trades', icon: '📊' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold">⚙️ Admin CMS Panel</h1>
          <p className="text-purple-100 mt-2">Manage users, trades, and platform settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-lg">Loading...</div>
              </div>
            ) : (
              <>
                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">User Management</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Balance</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">KYC Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-4 py-3 text-sm">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {user.email || user.phone}
                                  </div>
                                  <div className="text-gray-500">ID: {user.id}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <input
                                  type="number"
                                  defaultValue={user.balance}
                                  onBlur={(e) => {
                                    if (e.target.value !== user.balance.toString()) {
                                      updateUserBalance(user.id, e.target.value);
                                    }
                                  }}
                                  className="w-24 px-2 py-1 border rounded text-sm"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <select
                                  value={user.kycStatus || 'pending'}
                                  onChange={(e) => updateKYCStatus(user.id, e.target.value)}
                                  className="px-2 py-1 border rounded text-sm"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Trades Tab */}
                {activeTab === 'trades' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Trade Management</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Direction</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Entry Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payout</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {trades.map((trade) => (
                            <tr key={trade.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {trade.user?.email || trade.user?.phone || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                ${trade.amount}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  trade.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {trade.direction.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-mono">
                                {trade.entryPrice?.toFixed(5)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  trade.status === 'won' ? 'bg-green-100 text-green-800' :
                                  trade.status === 'lost' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {trade.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {trade.payout ? `$${trade.payout.toFixed(2)}` : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(trade.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Platform Settings</h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Commission Settings</h3>
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          value={settings.commissionRate}
                          onChange={(e) => setSettings({
                            ...settings,
                            commissionRate: e.target.value
                          })}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <button
                          onClick={updateCommissionRate}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Update
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        This is the commission rate applied to winning trades
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Platform Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl font-bold text-indigo-600">{users.length}</div>
                          <div className="text-sm text-gray-500">Total Users</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{trades.length}</div>
                          <div className="text-sm text-gray-500">Total Trades</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            ${trades.reduce((sum, trade) => sum + trade.amount, 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">Total Volume</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCMS;