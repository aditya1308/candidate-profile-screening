import { useContext } from 'react';
import { AuthContext } from './AuthContextDef';

export const useAuth = () => {
  return useContext(AuthContext);
};
