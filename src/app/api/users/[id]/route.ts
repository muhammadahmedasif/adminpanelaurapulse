import { NextResponse } from "next/server";
import { mockDb, logAdminAction } from "@/services/mockDb";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const userIndex = mockDb.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (body.status !== undefined) {
      mockDb.users[userIndex].status = body.status;
      logAdminAction(`Modified status of user ${mockDb.users[userIndex].name} to ${body.status}`);
    }

    return NextResponse.json({ success: true, user: mockDb.users[userIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const userIndex = mockDb.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userName = mockDb.users[userIndex].name;
    mockDb.users.splice(userIndex, 1);
    logAdminAction(`Deleted user account: ${userName} (${id})`);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
