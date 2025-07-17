import React, { createContext, useContext, useState, useEffect } from 'react';
import { GFG_ROUTES } from '../gfgRoutes/gfgRoutes';
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

  useEffect(() => {
    // Check if user is stored in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      // Simulate login API call
      const response = await axios.post(`${GFG_ROUTES.LOGIN}`,userData);
    
      console.log("response from auth login page ", response);
      const user = response.data.user;      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};