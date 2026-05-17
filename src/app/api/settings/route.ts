import { NextResponse } from "next/server";
import { mockDb, logAdminAction } from "@/services/mockDb";

export async function GET() {
  try {
    return NextResponse.json({ success: true, settings: mockDb.settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (body.emergencySystemEnabled !== undefined) {
      mockDb.settings.emergencySystemEnabled = body.emergencySystemEnabled;
      logAdminAction(`Modified setting 'Emergency System Enabled' to ${body.emergencySystemEnabled}`);
    }
    if (body.cooldownHours !== undefined) {
      mockDb.settings.cooldownHours = parseInt(body.cooldownHours, 10);
      logAdminAction(`Modified setting 'Cooldown Hours' to ${body.cooldownHours}`);
    }
    if (body.maintenanceMode !== undefined) {
      mockDb.settings.maintenanceMode = body.maintenanceMode;
      logAdminAction(`Modified setting 'Maintenance Mode' to ${body.maintenanceMode}`);
    }
    if (body.aiChatEnabled !== undefined) {
      mockDb.settings.aiChatEnabled = body.aiChatEnabled;
      logAdminAction(`Modified setting 'AI Chat Enabled' to ${body.aiChatEnabled}`);
    }
    if (body.rateLimitThreshold !== undefined) {
      mockDb.settings.rateLimitThreshold = parseInt(body.rateLimitThreshold, 10);
      logAdminAction(`Modified setting 'Rate Limit Threshold' to ${body.rateLimitThreshold}`);
    }

    return NextResponse.json({ success: true, settings: mockDb.settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
