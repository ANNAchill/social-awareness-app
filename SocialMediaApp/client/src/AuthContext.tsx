import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type UserMe } from './api';

const AuthContext = createContext<{
  user: UserMe;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  registerAdmin: (adminKey: string, fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(user?.roles?.includes('Admin'));

  const refresh = async () => {
    try {
      const u = await api.account.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const u = await api.account.login(email, password);
    setUser(u);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const u = await api.account.register(fullName, email, password);
    setUser(u);
  };

  const registerAdmin = async (adminKey: string, fullName: string, email: string, password: string) => {
    const u = await api.account.registerAdmin(adminKey, fullName, email, password);
    setUser(u);
  };

  const logout = async () => {
    setUser(null);
    try {
      await api.account.logout();
    } catch {
      // already cleared above; session may be gone
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, registerAdmin, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
