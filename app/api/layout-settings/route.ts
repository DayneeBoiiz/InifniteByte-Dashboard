import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Fetch user's layout settings
export async function GET() {
  const clerkInstance = await clerkClient();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user data
    const user = await clerkInstance.users.getUser(userId);
    const metadata = user.publicMetadata as {
      layoutSettings?: {
        collapsible?: string;
        variant?: string;
        sidebarOpen?: boolean;
      };
    };

    // Return layout settings or defaults
    const layoutSettings = metadata.layoutSettings || {
      collapsible: "offcanvas",
      variant: "sidebar",
      sidebarOpen: true,
    };

    return NextResponse.json(layoutSettings);
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: "Failed to fetch layout settings" },
      { status: 500 }
    );
  }
}

// POST - Update user's layout settings
export async function POST(req: Request) {
  const clerkInstance = await clerkClient();
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await req.json();

    // Get current user data
    const user = await clerkInstance.users.getUser(userId);
    const currentMetadata = user.publicMetadata as {
      layoutSettings?: {
        collapsible?: string;
        variant?: string;
        sidebarOpen?: boolean;
      };
    };

    // Merge new settings with existing ones
    const updatedLayoutSettings = {
      ...(currentMetadata.layoutSettings || {}),
      ...settings,
    };

    // Update user metadata
    await clerkInstance.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        layoutSettings: updatedLayoutSettings,
      },
    });

    return NextResponse.json({
      success: true,
      layoutSettings: updatedLayoutSettings,
    });
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: "Failed to update layout settings" },
      { status: 500 }
    );
  }
}
