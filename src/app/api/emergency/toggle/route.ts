import { NextResponse } from "next/server";
import { mockDb, logAdminAction } from "@/services/mockDb";

export async function POST() {
  try {
    mockDb.settings.emergencySystemEnabled = !mockDb.settings.emergencySystemEnabled;
    const isEnabled = mockDb.settings.emergencySystemEnabled;

    logAdminAction(`Global Emergency System Kill-Switch toggled to ${isEnabled ? "ON / ACTIVE" : "OFF / DISABLED"}`);

    return NextResponse.json({
      success: true,
      emergencySystemEnabled: isEnabled
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to toggle emergency system" }, { status: 500 });
  }
}
