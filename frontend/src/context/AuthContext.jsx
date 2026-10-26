import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/services';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fitlife_token'));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await userService.getProfile();
          setUser(data);
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.removeItem('fitlife_token');
          localStorage.removeItem('fitlife_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('fitlife_token', data.token);
    localStorage.setItem('fitlife_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await authService.register({ name, email, password });
    localStorage.setItem('fitlife_token', data.token);
    localStorage.setItem('fitlife_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fitlife_token');
    localStorage.removeItem('fitlife_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fitlife_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isOnboardingDone: user?.isOnboardingDone,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
