import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Trading', icon: '📈' },
    { path: '/wallet', label: 'Wallet', icon: '💰' },
    { path: '/referral', label: 'Referral', icon: '👥' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-bold">
                Tradex
              </Link>
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-accent text-white'
                        : 'text-gray-300 hover:bg-secondary hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {user?.phone || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-danger hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;