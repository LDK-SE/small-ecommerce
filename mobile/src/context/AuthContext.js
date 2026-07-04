import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrateSession() {
      try {
        const token = await storage.getItem('token');
        const savedUser = await storage.getJSON('user');

        if (!mounted) {
          return;
        }

        if (savedUser) {
          setUser(savedUser);
        }

        if (token) {
          const freshUser = await api.getMe();
          await storage.setJSON('user', freshUser);
          if (mounted) {
            setUser(freshUser);
          }
        }
      } catch (error) {
        await storage.removeItem('token');
        await storage.removeItem('user');
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      mounted = false;
    };
  }, []);

  const saveSession = async (data) => {
    await storage.setItem('token', data.token);
    await storage.setJSON('user', data.user);
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await api.login(credentials);
    await saveSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    await saveSession(data);
    return data.user;
  };

  const logout = async () => {
    await storage.removeItem('token');
    await storage.removeItem('user');
    await storage.removeItem('cart');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
