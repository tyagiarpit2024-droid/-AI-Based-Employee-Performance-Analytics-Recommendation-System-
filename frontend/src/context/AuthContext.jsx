import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userData = { _id: res.data._id, name: res.data.name, email: res.data.email };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', res.data.token);
    const userData = { _id: res.data._id, name: res.data.name, email: res.data.email };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
