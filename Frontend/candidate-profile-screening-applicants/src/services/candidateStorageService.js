// Storage service for managing Candidate authentication storage
const TOKEN_KEY = 'candidate_jwt_token';
const USER_KEY = 'candidate_user';

export const candidateStorageService = {
  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving candidate token:', error);
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
    } catch (error) {
      console.error('Error reading candidate token:', error);
      return null;
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing candidate token:', error);
    }
  },

  setUser: (user) => {
    try {
      const serialized = JSON.stringify(user);
      localStorage.setItem(USER_KEY, serialized);
      sessionStorage.setItem(USER_KEY, serialized);
    } catch (error) {
      console.error('Error saving candidate user:', error);
    }
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error reading candidate user:', error);
      return null;
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing candidate user:', error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing candidate storage:', error);
    }
  }
};
