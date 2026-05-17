import { NextResponse } from "next/server";
import { mockDb } from "@/services/mockDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let filteredSessions = mockDb.sessions;

    if (search) {
      filteredSessions = filteredSessions.filter(
        (s) =>
          s.userName.toLowerCase().includes(search) ||
          s.id.toLowerCase().includes(search)
      );
    }

    if (status !== "all") {
      filteredSessions = filteredSessions.filter((s) => s.status === status);
    }

    const total = filteredSessions.length;
    const startIndex = (page - 1) * limit;
    const paginatedSessions = filteredSessions.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      sessions: paginatedSessions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve therapy sessions" }, { status: 500 });
  }
}
