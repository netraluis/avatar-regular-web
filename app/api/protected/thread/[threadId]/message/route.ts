import { createMessage } from "@/lib/openAI/message";
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

    const { message } = body;

    const messageResult = await createMessage({ threadId, message });

    console.log("Message created:", JSON.stringify(messageResult, null, 2));

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
