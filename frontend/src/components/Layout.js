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
    <div className="min-h-screen flex bg-[#10131a]">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-[#181c27] text-white flex flex-col py-6 px-2 md:px-4 shadow-lg">
        <div className="flex items-center mb-10 px-2">
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold tracking-tight text-accent"
          >
            TRADEX
          </Link>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg font-semibold transition-colors duration-200 text-base md:text-lg hover:bg-accent/20 ${
                location.pathname === item.path
                  ? 'bg-accent text-white shadow'
                  : 'text-gray-300'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center md:items-start px-2">
          <span className="text-xs text-gray-400 mb-2">
            {user?.phone || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="w-full bg-danger hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 flex items-center px-6 bg-[#181c27] border-b border-[#23273a] shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Trading Platform
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-8 bg-[#10131a] overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;