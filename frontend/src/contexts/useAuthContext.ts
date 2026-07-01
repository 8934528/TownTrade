import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { UseAuthReturn } from '../hooks/useAuth';

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
