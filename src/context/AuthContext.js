import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initially check if token exists in localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Boolean for auth check
  const isAuthenticated = !!token;

  // Save token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Optionally decode token and set user info here
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Login function - save token
  const login = (token) => {
    setToken(token);
  };

  // Logout function - remove token
  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
