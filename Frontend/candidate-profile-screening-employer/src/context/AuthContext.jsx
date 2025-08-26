import { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../../../shared/data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUsers, setTempUsers] = useState([]); // Temporary storage for new registrations

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load temporary users from localStorage
    const savedTempUsers = localStorage.getItem('tempUsers');
    if (savedTempUsers) {
      setTempUsers(JSON.parse(savedTempUsers));
    }
    
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // First check existing users
    let user = users.find(u => u.email === email && u.password === password);
    
    // If not found in existing users, check temporary users
    if (!user) {
      user = tempUsers.find(u => u.email === email && u.password === password);
    }
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (userData) => {
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    const existingTempUser = tempUsers.find(u => u.email === userData.email);
    
    if (existingUser || existingTempUser) {
      return { success: false, error: 'Email already exists' };
    }

    // Create new user with unique ID
    const newUser = {
      id: Date.now(), // Simple unique ID generation
      ...userData,
      department: userData.role === 'talent-acquisition' ? 'Human Resources' : 'Engineering'
    };

    // Add to temporary users
    const updatedTempUsers = [...tempUsers, newUser];
    setTempUsers(updatedTempUsers);
    localStorage.setItem('tempUsers', JSON.stringify(updatedTempUsers));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
