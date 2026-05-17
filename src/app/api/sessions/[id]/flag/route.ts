import { NextResponse } from "next/server";
import { mockDb, logAdminAction } from "@/services/mockDb";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const sessionIndex = mockDb.sessions.findIndex((s) => s.id === id);

    if (sessionIndex === -1) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    // Toggle flagged status
    const currentFlag = mockDb.sessions[sessionIndex].flagged;
    mockDb.sessions[sessionIndex].flagged = !currentFlag;

    logAdminAction(`${!currentFlag ? "Flagged" : "Unflagged"} therapy session ${id} for moderation`);

    return NextResponse.json({ success: true, session: mockDb.sessions[sessionIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to flag session" }, { status: 500 });
  }
}
