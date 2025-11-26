import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST() {
  const clerkInstance = await clerkClient();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user metadata
    const user = await clerkInstance.users.getUser(userId);
    const currentMetadata = user.publicMetadata as {
      dailyViews?: number;
      lastResetDate?: string;
      weekViews?: Array<{ day: string; views: number; date: string }>;
      viewedContacts?: string[];
      lastUpdated?: string;
    };

    // Get existing week views or initialize
    const weekViews = Array.isArray(currentMetadata.weekViews)
      ? [...currentMetadata.weekViews]
      : [];

    // Update week views
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    const todayIndex = weekViews.findIndex((day) => day.day === todayStr);

    if (todayIndex >= 0) {
      weekViews[todayIndex].views += 1;
      weekViews[todayIndex].date = new Date().toISOString();
    } else {
      weekViews.push({
        day: todayStr,
        views: 1,
        date: new Date().toISOString(),
      });
    }

    // Keep only last 7 days
    if (weekViews.length > 7) {
      weekViews.shift();
    }

    // Update user metadata in Clerk - ONLY update weekViews and lastUpdated
    await clerkInstance.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...currentMetadata, // This preserves all existing fields
        weekViews, // We only update this
        lastUpdated: new Date().toISOString(), // We update this
      },
    });

    return NextResponse.json({
      success: true,
      weekViews,
    });
  } catch (error) {
    console.error("Error updating week views:", error);
    return NextResponse.json(
      { error: "Failed to update week views" },
      { status: 500 }
    );
  }
}
