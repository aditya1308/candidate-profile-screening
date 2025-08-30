import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user is authenticated on app start
    if (authService.isAuthenticated()) {
      return storageService.getUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        const userInfo = storageService.getUser();
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user: userInfo } = await authService.login(email, password);
      console.log('User info from login:', userInfo);
      setUser(userInfo);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (adminData) => {
    try {
      setLoading(true);
      const result = await authService.register(adminData);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onboardUser = async (onboardData) => {
    try {
      setLoading(true);
      const result = await authService.onboardUser(onboardData);
      return result;
    } catch (error) {
      console.error('Onboarding error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllInterviewers = async () => {
    try {
      const interviewers = await authService.getAllInterviewers();
      return interviewers;
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      onboardUser,
      getAllInterviewers,
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
