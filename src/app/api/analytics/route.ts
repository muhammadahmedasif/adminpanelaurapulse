import { NextResponse } from "next/server";
import { mockDb } from "@/services/mockDb";

export async function GET() {
  try {
    const totalUsers = mockDb.users.length;
    const activeUsers = mockDb.users.filter((u) => u.status === "active").length;
    const totalSessions = mockDb.sessions.length;
    const emergencyEventsCount = mockDb.emergencyEvents.length;
    const failedLogins = mockDb.logs.filter(
      (log) => log.category === "SECURITY" && log.description.toLowerCase().includes("failed")
    ).length;

    // Simple operational trend metrics for SVG graphing
    const systemUsageTrend = [
      { date: "05-12", sessions: 4 },
      { date: "05-13", sessions: 7 },
      { date: "05-14", sessions: 5 },
      { date: "05-15", sessions: 9 },
      { date: "05-16", sessions: 12 },
      { date: "05-17", sessions: totalSessions + 10 }
    ];

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        totalSessions,
        emergencyEventsCount,
        failedLogins,
        systemUsageTrend
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve metrics" }, { status: 500 });
  }
}
