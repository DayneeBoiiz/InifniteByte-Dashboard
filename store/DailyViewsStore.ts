import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DailyViewsState {
  dailyViews: number;
  lastResetDate: string;
  weekViews: WeekView[];
  incrementDailyViews: () => void;
  resetDailyViews: () => void;
  canViewContacts: () => boolean;
  getRemainingViews: () => number;
  setDailyViews: (views: number, resetDate: string) => void;
  setWeekViews: (weekViews: WeekView[]) => void;
  initializeWeekViews: () => void;
}

export const useDailyViewsStore = create<DailyViewsState>()(
  persist(
    (set, get) => ({
      dailyViews: 0,
      lastResetDate: new Date().toISOString().split("T")[0], // Store only date part
      weekViews: [],

      incrementDailyViews: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        // Reset if it's a new day
        if (state.lastResetDate !== today) {
          set({ dailyViews: 1, lastResetDate: today });
        } else {
          set({ dailyViews: state.dailyViews + 1 });
        }
      },

      resetDailyViews: () => {
        const today = new Date().toISOString().split("T")[0];
        set({ dailyViews: 0, lastResetDate: today });
      },

      canViewContacts: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        // Reset if it's a new day
        if (state.lastResetDate !== today) {
          set({ dailyViews: 0, lastResetDate: today });
          return true;
        }

        return state.dailyViews < 50;
      },

      getRemainingViews: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        // Reset if it's a new day
        if (state.lastResetDate !== today) {
          set({ dailyViews: 0, lastResetDate: today });
          return 50;
        }

        return Math.max(0, 50 - state.dailyViews);
      },

      setDailyViews: (views: number, date: string) => {
        set({ dailyViews: views, lastResetDate: date });
      },

      setWeekViews: (weekViews: WeekView[]) => {
        set({ weekViews });
      },

      initializeWeekViews: () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekViews = days.map((day) => ({
          day,
          views: Math.floor(Math.random() * 50), // Sample data
          date: new Date().toISOString(),
        }));
        set({ weekViews });
      },
    }),
    {
      name: "daily-views-storage",
      // You can also sync with localStorage for persistence across sessions
    }
  )
);
