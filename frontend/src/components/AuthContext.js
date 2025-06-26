import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const TRADERSX_TOKEN = process.env.REACT_APP_TRADERSX_TOKEN;
  
  // Test API connection
  const testConnection = async () => {
    try {
      await axios.get(`${API_URL}/health`);
      console.log('API connection successful');
    } catch (error) {
      console.error('API connection failed:', error.message);
      console.error('API URL:', API_URL);
    }
  };

  useEffect(() => {
    testConnection();
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (identifier, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login-password`, { identifier, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const login = async (identifier, otp) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { identifier, otp });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const sendOTP = async (identifier) => {
    try {
      await axios.post(`${API_URL}/api/auth/send-otp`, { identifier });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    loginWithPassword,
    sendOTP,
    logout,
    API_URL,
    TRADERSX_TOKEN
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};