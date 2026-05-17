import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mockDb, logAdminAction } from "@/services/mockDb";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "session-token-token-12345") {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: mockDb.adminProfile
  });
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "session-token-token-12345") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const oldName = mockDb.adminProfile.name;
    mockDb.adminProfile.name = name.trim();
    
    logAdminAction(`Changed admin user name from "${oldName}" to "${name.trim()}"`);

    return NextResponse.json({
      success: true,
      user: mockDb.adminProfile
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile name" }, { status: 500 });
  }
}
