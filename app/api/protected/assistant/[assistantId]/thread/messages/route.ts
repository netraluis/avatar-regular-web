import { getPaginatedThreadsMessages } from "@/lib/data/message";
import { Message } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { threadId: string; assistantId: string } },
) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const limitMessagesPerThread = searchParams.get("limitMessagesPerThread");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const pageNumber = parseInt(page || "1");
  const pageSizeNumber = parseInt(pageSize || "4");
  const limitMessagesPerThreadNumber = parseInt(limitMessagesPerThread || "2");

  try {
    const messagesDB: { messages: Message[]; totalThreads: number } =
      await getPaginatedThreadsMessages({
        page: pageNumber,
        pageSize: pageSizeNumber,
        limitMessagesPerThread: limitMessagesPerThreadNumber,
        assistantId: params.assistantId,
        dateFrom,
        dateTo,
      });

    const groupedMessages = messagesDB.messages.reduce(
      (acc: any, message: any) => {
        const { threadId, role, message: text, createdAt } = message;
        console.log({ threadId, role, text });

        if (!acc[threadId]) {
          acc[threadId] = {
            threadId,
            messages: [],
          };
        }

        acc[threadId].messages.push({
          role,
          message: text,
          createdAt,
        });
        return acc;
      },
      {},
    );

    const messages = Object.values(groupedMessages);

    return new NextResponse(
      JSON.stringify({ messages, totalThreads: messagesDB.totalThreads }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error getting messages:", error);

    return new NextResponse("Failed getting messages", {
      status: 500,
    });
  }
}

// [{threaId, messages: [
// 	{
// 	role:
// 	message:
// 	}
// ]}]
