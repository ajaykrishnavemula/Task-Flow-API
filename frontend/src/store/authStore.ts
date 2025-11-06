import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { authService, socketService } from '@/services';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          if (response.success && response.data) {
            const { token, ...user } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Connect to socket
            socketService.connect(token);
            
            toast.success('Login successful!');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          if (response.success && response.data) {
            const { token, ...user } = response.data;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Connect to socket
            socketService.connect(token);
            
            toast.success('Registration successful!');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          
          // Disconnect socket
          socketService.disconnect();
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          toast.success('Logged out successfully');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error('Logout failed');
        }
      },

      getCurrentUser: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Connect to socket if not connected
            if (!socketService.isConnected()) {
              socketService.connect(token);
            }
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to get user';
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(data);
          if (response.success && response.data) {
            set({
              user: response.data,
              isLoading: false,
            });
            toast.success('Profile updated successfully');
          }
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to update profile';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

