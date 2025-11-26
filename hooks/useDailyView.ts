"use client";

import { useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useDailyViewsStore } from "@/store/DailyViewsStore";
import axios from "axios";

export function useDailyViews() {
  const { user } = useUser();
  const {
    dailyViews,
    lastResetDate,
    weekViews,
    incrementDailyViews,
    canViewContacts,
    getRemainingViews,
    setDailyViews,
    setWeekViews,
  } = useDailyViewsStore();

  // Update Clerk user metadata for week views only
  const updateWeekViews = useCallback(async () => {
    if (!user) return;

    try {
      const { data } = await axios.post("/api/week-views");

      if (data.success) {
        setWeekViews(data.weekViews);
      }
    } catch (error) {
      void error;
    }
  }, [user, setWeekViews]);

  // Update Clerk user metadata for daily views
  const updateUserMetadata = useCallback(async () => {
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: {
          dailyViews,
          lastResetDate,
          weekViews,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {
      void error;
    }
  }, [user, dailyViews, lastResetDate, weekViews]);

  // Sync with Clerk user metadata on mount
  useEffect(() => {
    if (user) {
      const publicMetadata = user.publicMetadata as {
        dailyViews?: number;
        lastResetDate?: string;
        weekViews?: { day: string; views: number }[];
      };

      if (
        publicMetadata.dailyViews !== undefined &&
        publicMetadata.lastResetDate
      ) {
        // Use the server data if available
        setDailyViews(publicMetadata.dailyViews, publicMetadata.lastResetDate);

        // Set week views if available
        if (publicMetadata.weekViews) {
          setWeekViews(publicMetadata.weekViews);
        }
      } else {
        // Initialize server data
        updateUserMetadata();
      }
    }
  }, [setDailyViews, setWeekViews, updateUserMetadata, user]);

  // Increment views and update both endpoints
  const incrementAndSync = async () => {
    if (!canViewContacts()) {
      return false;
    }

    // Update local store first
    incrementDailyViews();

    // Update both endpoints
    updateWeekViews(); // Update week views separately
    setTimeout(updateUserMetadata, 500); // Update daily views with delay

    return true;
  };

  // Reset views (admin function)
  const resetAndSync = async () => {
    useDailyViewsStore.getState().resetDailyViews();
    await updateUserMetadata();
  };

  return {
    dailyViews,
    lastResetDate,
    weekViews,
    incrementDailyViews: incrementAndSync,
    resetDailyViews: resetAndSync,
    canViewContacts,
    getRemainingViews,
    hasExceededLimit: !canViewContacts(),
  };
}
