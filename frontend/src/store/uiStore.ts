import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode, ViewMode } from '@/types';

interface UIState {
  theme: ThemeMode;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  isMobile: boolean;
}

interface UIActions {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'light',
      viewMode: 'list',
      sidebarOpen: true,
      isMobile: false,

      // Actions
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setIsMobile: (isMobile: boolean) => {
        set({ isMobile });
        // Auto-close sidebar on mobile
        if (isMobile) {
          set({ sidebarOpen: false });
        }
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

