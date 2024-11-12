import { createMessage } from "@/lib/openAI/message";
import { createMessage as createMessageInDB } from "@/lib/data/message";
import { RoleUserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const { threadId } = params;

    const body = await request.json();

    const { message, assistantId } = body;

    if (!assistantId) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    const messageResult = await createMessage({ threadId, message });

    await createMessageInDB({
      role: RoleUserType.USER,
      message: message,
      threadId,
      filesId: [],
      runId: null,
      assistant: { connect: { id: assistantId } },
    });

    return new NextResponse(JSON.stringify(messageResult), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating team:", error);

    return new NextResponse("Failed creating team", {
      status: 500,
    });
  }
}
