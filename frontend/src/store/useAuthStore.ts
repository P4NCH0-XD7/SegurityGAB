import { create } from 'zustand';

interface User {
  id: string;
  name?: string;
  email?: string;
  roleId?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  login: (user, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isInitialized: true });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isInitialized: true });
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
}));
