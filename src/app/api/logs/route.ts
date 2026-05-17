import { NextResponse } from "next/server";
import { mockDb } from "@/services/mockDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "ALL";
    const severity = searchParams.get("severity") || "ALL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let filteredLogs = mockDb.logs;

    if (category !== "ALL") {
      filteredLogs = filteredLogs.filter((log) => log.category === category);
    }

    if (severity !== "ALL") {
      filteredLogs = filteredLogs.filter((log) => log.severity === severity);
    }

    const total = filteredLogs.length;
    const startIndex = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      logs: paginatedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve logs" }, { status: 500 });
  }
}
