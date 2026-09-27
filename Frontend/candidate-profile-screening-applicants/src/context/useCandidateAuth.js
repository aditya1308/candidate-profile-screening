import { useContext } from 'react';
import { CandidateAuthContext } from './CandidateAuthContextDef';

export const useCandidateAuth = () => {
  const context = useContext(CandidateAuthContext);
  if (!context) {
    throw new Error('useCandidateAuth must be used within a CandidateAuthProvider');
  }
  return context;
};

export const useAuth = useCandidateAuth;
