import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logAdminAction } from "@/services/mockDb";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === "admin" && password === "admin123") {
      const cookieStore = cookies();
      // Set session token
      cookieStore.set("admin_session", "session-token-token-12345", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 2, // 2 hours
      });

      logAdminAction("Administrator authenticated successfully");

      return NextResponse.json({ success: true, user: { name: "Admin User", role: "Administrator" } });
    }

    return NextResponse.json({ success: false, error: "Invalid administrative credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
