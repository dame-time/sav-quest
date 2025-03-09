import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
      // If token is invalid, clear it
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sign in
  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
        username: email,
        password: password
      });
      
      localStorage.setItem('token', response.data.access_token);
      await fetchUserData();
      return { success: true };
    } catch (err) {
      console.error('Sign in error:', err);
      return { 
        success: false, 
        message: err.response?.data?.detail || 'Failed to sign in. Please check your credentials.'
      };
    }
  };

  // Function to handle sign out
  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Function to handle sign up
  const signUp = async (email, password, name) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/register`, {
        email,
        password,
        full_name: name
      });
      
      localStorage.setItem('token', response.data.access_token);
      await fetchUserData();
      return { success: true };
    } catch (err) {
      console.error('Sign up error:', err);
      return { 
        success: false, 
        message: err.response?.data?.detail || 'Failed to create account. Please try again.'
      };
    }
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    fetchUserData();
  }, []);

  // Create the value object that will be provided to consumers
  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 