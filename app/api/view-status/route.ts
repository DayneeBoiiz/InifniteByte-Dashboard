import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const clerkInstance = await clerkClient();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await clerkInstance.users.getUser(userId);
    const metadata = user.publicMetadata as {
      dailyViews?: number;
      lastResetDate?: string;
      viewedContacts?: string[];
    };

    const today = new Date().toISOString().split("T")[0];
    let dailyViews = metadata.dailyViews || 0;
    let viewedContacts = metadata.viewedContacts || [];
    const lastResetDate = metadata.lastResetDate || today;

    // Reset if it's a new day
    if (lastResetDate !== today) {
      dailyViews = 0;
      viewedContacts = [];

      // Update metadata with reset values
      await clerkInstance.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          dailyViews: 0,
          lastResetDate: today,
          viewedContacts: [],
        },
      });
    }

    return NextResponse.json({
      dailyViews,
      remainingViews: Math.max(0, 50 - dailyViews),
      hasExceededLimit: dailyViews >= 50,
      lastResetDate,
      viewedContacts,
    });
  } catch (error) {
    console.error("Error getting view status:", error);
    return NextResponse.json(
      { error: "Failed to get view status" },
      { status: 500 }
    );
  }
}
