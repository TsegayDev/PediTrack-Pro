import { create } from 'zustand';
import { persist, createJSONStorage, type PersistStorage } from 'zustand/middleware';
import { Activity } from '@/lib/types';

interface ActivityState {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  getActivity: (id: string) => Activity | undefined;
  deleteActivity: (id: string) => void;
  deleteActivities: (ids: string[]) => void;
  clearHistory: () => void;
}

// This is a dummy storage object that does nothing. It's used on the server
// where sessionStorage is not available.
const dummyStorage: PersistStorage<ActivityState> = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

// Custom storage implementation that is SSR-safe.
// It uses a dummy storage on the server and sessionStorage in the browser.
const storage: PersistStorage<ActivityState> = {
  getItem: (name) => {
    const str = typeof window !== 'undefined' ? sessionStorage.getItem(name) : null;
    if (!str) {
      return null;
    }
    return JSON.parse(str);
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(name);
    }
  },
};

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
      getActivity: (id) => get().activities.find(a => a.id === id),
      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter((activity) => activity.id !== id),
      })),
      deleteActivities: (ids) => set((state) => ({
        activities: state.activities.filter((activity) => !ids.includes(activity.id)),
      })),
      clearHistory: () => set({ activities: [] }),
    }),
    {
      name: 'pedi-track-pro-activity-storage',
      // Use the dummy storage on the server and sessionStorage on the client
      storage: typeof window === 'undefined' ? dummyStorage : storage,
    }
  )
);
