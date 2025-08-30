// Storage service for managing sessionStorage operations
export const storageService = {
  // User storage
  setUser: (user) => {
    try {
      sessionStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to sessionStorage:', error);
    }
  },

  getUser: () => {
    try {
      const user = sessionStorage.getItem('user');
      const parsedUser = user ? JSON.parse(user) : null;
      console.log('Retrieved user from storage:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('Error reading user from sessionStorage:', error);
      return null;
    }
  },

  removeUser: () => {
    try {
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user from sessionStorage:', error);
    }
  },

  // Generic storage methods
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to sessionStorage:`, error);
    }
  },

  getItem: (key) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from sessionStorage:`, error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from sessionStorage:`, error);
    }
  },

  // Clear all storage
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },

  // Check if sessionStorage is available
  isAvailable: () => {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (error) {
      console.error('Error checking sessionStorage availability:', error);
      return false;
    }
  }
};
