import { NextResponse } from "next/server";
import { mockDb } from "@/services/mockDb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Filter
    let filteredUsers = mockDb.users;
    if (search) {
      filteredUsers = filteredUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }
    if (status !== "all") {
      filteredUsers = filteredUsers.filter((u) => u.status === status);
    }

    // Pagination
    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve users" }, { status: 500 });
  }
}
