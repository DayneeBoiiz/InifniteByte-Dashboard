import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const clerkInstance = await clerkClient();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID required" },
        { status: 400 }
      );
    }

    // Get current user data
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
    }

    // Check if contact already viewed
    if (viewedContacts.includes(contactId)) {
      return NextResponse.json({
        success: true,
        alreadyViewed: true,
        dailyViews,
        remainingViews: 50 - dailyViews,
        hasExceededLimit: dailyViews >= 50,
        viewedContacts,
      });
    }

    // Check if limit exceeded
    if (dailyViews >= 50) {
      return NextResponse.json(
        {
          error: "Daily limit exceeded",
          dailyViews,
          remainingViews: 0,
          hasExceededLimit: true,
          viewedContacts,
        },
        { status: 403 }
      );
    }

    // Increment views and add contact to viewed list
    dailyViews += 1;
    viewedContacts.push(contactId);

    // Update user metadata
    await clerkInstance.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        dailyViews,
        lastResetDate: today,
        viewedContacts,
      },
    });

    return NextResponse.json({
      success: true,
      alreadyViewed: false,
      dailyViews,
      remainingViews: 50 - dailyViews,
      hasExceededLimit: dailyViews >= 50,
      viewedContacts,
    });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
