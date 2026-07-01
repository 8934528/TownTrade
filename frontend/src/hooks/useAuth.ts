import { useState, useCallback } from 'react';
import { authService } from '../services/auth';
import type { User, LoginCredentials, RegisterData } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: () => Promise<void>;
}

interface AxiosLikeError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const useAuth = (): UseAuthReturn => {
  // Lazy initializer — runs once and avoids setState inside useEffect
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser() ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      if (response.user.role === 'business') {
        navigate('/business-dash');
      } else {
        navigate('/customer-dash');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosLikeError;
      setError(axiosError.response?.data?.detail || 'Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.register(data);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err: unknown) {
      const axiosError = err as AxiosLikeError;
      setError(axiosError.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      navigate('/');
    } catch (err: unknown) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const updateUser = useCallback(async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
    } catch (err: unknown) {
      console.error('Failed to update user:', err);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };
};
