import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Referral = () => {
  const { user, API_URL } = useAuth();
  const [referralData, setReferralData] = useState({
    code: '',
    totalReferrals: 0,
    totalEarnings: 0,
    referrals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/referral/stats`);
      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/login?ref=${referralData.code}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.code);
    toast.success('Referral code copied to clipboard!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">👥 Referral Program</h1>
          <p className="text-purple-100">
            Invite friends and earn 10% commission on their trading profits!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent bg-opacity-10 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-accent">${referralData.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commission Rate</p>
                <p className="text-2xl font-bold text-blue-600">10%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">🔗 Your Referral Code</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Referral Code:</p>
                <p className="text-2xl font-mono font-bold text-primary">{referralData.code}</p>
              </div>
              <button
                onClick={copyReferralCode}
                className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Referral Link:</p>
                <p className="text-sm font-mono text-gray-800 break-all">
                  {window.location.origin}/login?ref={referralData.code}
                </p>
              </div>
              <button
                onClick={copyReferralLink}
                className="bg-accent hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors ml-4"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">📋 How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📤</span>
              </div>
              <h3 className="font-bold mb-2">1. Share Your Link</h3>
              <p className="text-gray-600 text-sm">
                Share your referral link with friends and family
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-bold mb-2">2. They Sign Up</h3>
              <p className="text-gray-600 text-sm">
                Your friends register using your referral code
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-bold mb-2">3. Earn Commission</h3>
              <p className="text-gray-600 text-sm">
                Get 10% of their trading profits as commission
              </p>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">👥 Your Referrals</h2>
          {referralData.referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referralData.referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {referral.email || referral.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-accent">
                        ${referral.totalCommission?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-500">Start sharing your referral link to earn commissions!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Referral;