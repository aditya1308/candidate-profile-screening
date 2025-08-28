import { useState } from 'react';
import { users } from '../../../shared/data/mockData';
import { storageService } from '../services/storageService';
import { AuthContext } from './AuthContextDef';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return storageService.getUser();
  });

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userInfo = { ...foundUser };
      delete userInfo.password;
      setUser(userInfo);
      storageService.setUser(userInfo);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    storageService.removeUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
