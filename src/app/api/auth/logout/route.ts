import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logAdminAction } from "@/services/mockDb";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");

  logAdminAction("Administrator signed out");

  return NextResponse.json({ success: true });
}
