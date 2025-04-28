import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  level: number;
  experience: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  getSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting login with:', { email });
          
          const response = await fetch('http://localhost/server/api/login.php', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          console.log('Login response status:', response.status);
          const text = await response.text();
          console.log('Raw response:', text);
          
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error('Failed to parse response:', e);
            throw new Error('Invalid server response');
          }
          
          if (!data.success) {
            console.error('Login failed:', data.message);
            throw new Error(data.message || 'Login failed');
          }

          if (!data.data) {
            console.error('No user data received');
            throw new Error('No user data received');
          }

          console.log('Login successful, setting user data:', data.data);
          set({ 
            user: {
              id: data.data.perdorues_id.toString(),
              email: data.data.email,
              name: data.data.emri,
              role: data.data.roli,
              level: parseInt(data.data.leveli),
              experience: parseInt(data.data.pike_eksperience)
            }, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock registration - replace with actual auth logic
          const mockUser: User = {
            id: '1',
            email,
            name,
            role: 'citizen',
            level: 0,
            experience: 0
          };
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed', isLoading: false });
        }
      },

      getSession: async () => {
        set({ isLoading: true });
        try {
          // Mock session check - replace with actual session check
          const storedUser = localStorage.getItem('auth-storage');
          if (storedUser) {
            const { state } = JSON.parse(storedUser);
            if (state.user) {
              set({ user: state.user, isAuthenticated: true, isLoading: false });
              return;
            }
          }
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ error: 'Session check failed', isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
); 