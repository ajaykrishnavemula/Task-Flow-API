import { create } from 'zustand';
import type { Team, CreateTeamData, UpdateTeamData } from '@/types';
import { teamService } from '@/services';
import toast from 'react-hot-toast';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;
}

interface TeamActions {
  fetchTeams: () => Promise<void>;
  fetchTeam: (id: string) => Promise<void>;
  createTeam: (data: CreateTeamData) => Promise<Team | null>;
  updateTeam: (id: string, data: UpdateTeamData) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  clearError: () => void;
}

type TeamStore = TeamState & TeamActions;

export const useTeamStore = create<TeamStore>((set) => ({
  // Initial state
  teams: [],
  currentTeam: null,
  isLoading: false,
  error: null,

  // Actions
  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamService.getTeams();
      if (response.success && response.data) {
        set({
          teams: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch teams';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchTeam: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamService.getTeam(id);
      if (response.success && response.data) {
        set({
          currentTeam: response.data,
          isLoading: false,
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch team';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createTeam: async (data: CreateTeamData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamService.createTeam(data);
      if (response.success && response.data) {
        set((state) => ({
          teams: [...state.teams, response.data!],
          isLoading: false,
        }));
        toast.success('Team created successfully');
        return response.data;
      }
      return null;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create team';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateTeam: async (id: string, data: UpdateTeamData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamService.updateTeam(id, data);
      if (response.success && response.data) {
        set((state) => ({
          teams: state.teams.map((team) =>
            team._id === id ? response.data! : team
          ),
          currentTeam:
            state.currentTeam?._id === id ? response.data : state.currentTeam,
          isLoading: false,
        }));
        toast.success('Team updated successfully');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update team';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  deleteTeam: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamService.deleteTeam(id);
      if (response.success) {
        set((state) => ({
          teams: state.teams.filter((team) => team._id !== id),
          currentTeam: state.currentTeam?._id === id ? null : state.currentTeam,
          isLoading: false,
        }));
        toast.success('Team deleted successfully');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete team';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  setCurrentTeam: (team: Team | null) => {
    set({ currentTeam: team });
  },

  clearError: () => {
    set({ error: null });
  },
}));

