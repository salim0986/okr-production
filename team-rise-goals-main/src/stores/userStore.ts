import { create } from 'zustand';

export type UserRole = 'Admin' | 'Team Lead' | 'Employee';

interface UserState {
  userRole: UserRole;
  userName: string;
  userEmail: string;
  setUserRole: (role: UserRole) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userRole: 'Admin', // Default to Admin for demo
  userName: 'John Doe',
  userEmail: 'john.doe@company.com',
  setUserRole: (role) => set({ userRole: role }),
  setUserName: (name) => set({ userName: name }),
  setUserEmail: (email) => set({ userEmail: email }),
}));