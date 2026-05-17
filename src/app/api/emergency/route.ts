import { NextResponse } from "next/server";
import { mockDb } from "@/services/mockDb";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      events: mockDb.emergencyEvents,
      regions: mockDb.twilioRegions,
      twilioNumberStatus: {
        number: "+1 (855) 942-AURA",
        status: mockDb.settings.emergencySystemEnabled ? "Active & Secure" : "Disabled (Global Kill-Switch ON)",
        sid: "PN810283a81283c7128e9d8e71829e",
        voiceWebhook: "https://api.aurapulse.com/v1/twilio/voice",
        smsWebhook: "https://api.aurapulse.com/v1/twilio/sms"
      },
      callLogs: [
        { id: "CALL-981", timestamp: "2026-05-17 14:46:25", duration: "2m 14s", status: "Completed", routing: "Escalated to local EMS" },
        { id: "CALL-742", timestamp: "2026-05-16 11:12:04", duration: "5m 45s", status: "Completed", routing: "Contacted primary emergency backup" }
      ]
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load emergency monitoring data" }, { status: 500 });
  }
}
