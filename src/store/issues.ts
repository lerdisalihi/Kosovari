import { create } from 'zustand';

export type IssueCategory = 'traffic' | 'environment' | 'economy' | 'living' | 'damage' | 'heritage';

export interface Issue {
  id: string;
  category: IssueCategory;
  description: string;
  latitude: number;
  longitude: number;
  status: 'open' | 'in_progress' | 'resolved';
  user_id?: string;
  created_at: string;
  image_url?: string | File;
}

interface IssueStore {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  isReportingMode: boolean;
  setReportingMode: (mode: boolean) => void;
  fetchIssues: () => Promise<void>;
  addIssue: (issue: Omit<Issue, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateIssueStatus: (issueId: string, newStatus: 'open' | 'in_progress' | 'resolved') => Promise<void>;
}

export const useIssueStore = create<IssueStore>((set) => ({
  issues: [],
  loading: false,
  error: null,
  isReportingMode: false,

  setReportingMode: (mode) => set({ isReportingMode: mode }),

  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch issues from local state
      set({ issues: [], loading: false });
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      set({ error: error.message || 'Failed to fetch issues', loading: false });
    }
  },

  addIssue: async (issue: Omit<Issue, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newIssue: Issue = {
        ...issue,
        id: Math.random().toString(36).substr(2, 9),
        user_id: '',
        created_at: new Date().toISOString(),
      };
      set((state) => ({
        issues: [newIssue, ...state.issues],
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error adding issue:', error);
      set({ error: error.message, loading: false });
    }
  },

  updateIssueStatus: async (issueId: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    try {
      set((state) => ({
        issues: state.issues.map(issue =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      }));
    } catch (error: any) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }
}));

export const categoryLabels: Record<IssueCategory, string> = {
  traffic: 'Traffic',
  environment: 'Environment',
  economy: 'Economy',
  living: 'Living',
  damage: 'Damage',
  heritage: 'Heritage'
};

export const categoryIcons: Record<IssueCategory, string> = {
  traffic: '🚗',
  environment: '🌱',
  economy: '💼',
  living: '🏘️',
  damage: '🔧',
  heritage: '🏛️'
};

export const categoryMonsters: Record<IssueCategory, string> = {
  traffic: '/assets/monsters/monster-damage.png',
  environment: '/assets/monsters/monster-damage.png',
  economy: '/assets/monsters/monster-damage.png',
  living: '/assets/monsters/monster-damage.png',
  damage: '/assets/monsters/monster-damage.png',
  heritage: '/assets/monsters/monster-damage.png'
}; 