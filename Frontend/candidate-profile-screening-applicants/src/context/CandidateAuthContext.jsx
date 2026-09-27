import { useState, useEffect } from 'react';
import { candidateAuthService } from '../services/candidateAuthService.js';
import { candidateStorageService } from '../services/candidateStorageService.js';
import { CandidateAuthContext } from './CandidateAuthContextDef.js';

export const CandidateAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (candidateAuthService.isAuthenticated()) {
      return candidateStorageService.getUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (candidateAuthService.isAuthenticated()) {
        const userInfo = candidateStorageService.getUser();
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
      const result = await candidateAuthService.login(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Context login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (candidateData) => {
    try {
      setLoading(true);
      return await candidateAuthService.register(candidateData);
    } catch (error) {
      console.error('Context register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    candidateAuthService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return candidateAuthService.isAuthenticated();
  };

  return (
    <CandidateAuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </CandidateAuthContext.Provider>
  );
};
