import { AssistantResponse } from "ai";
import OpenAI from "openai";
import prisma from "../../../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export interface MessageDb {
  date: Date;
  threadId: string;
  message: string;
}

const manageThreadId = async (input: { threadId: string | null }) => {
  if (!input.threadId) {
    const threadId = (await openai.beta.threads.create({})).id;
    return { threadId, isNew: true };
  } else {
    return { threadId: input.threadId, isNew: false };
  }
};

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  // Create a thread if needed and save it to the database
  const { threadId } = await manageThreadId(input);

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  try {
    await prisma.messages.createMany({
      data: [
        {
          role: "user",
          message: input.message,
          threadId,
          domainId: 'andorraEU',
          createdAt: new Date()
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.OPENAI_ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      // forward run status would stream message deltas
      const runResult = await forwardStream(runStream);
      console.log({ runResult });
      if (
        runResult &&
        runResult.status === "completed" &&
        runResult.thread_id
      ) {
        const threadMessages: any = await openai.beta.threads.messages.list(
          runResult.thread_id,
          {
            order: "desc",
          },
        );
        console.log({
          threadMessages: JSON.stringify(threadMessages, null, 2),
        });
        try {
          if (threadMessages.data.length > 1) {
            const lastResponse = threadMessages.data[0]; // El primer mensaje en la lista ordenada es el más reciente

            const result = await prisma.messages.createMany({
              data: [
                {
                  role: lastResponse.role,
                  message: lastResponse.content[0].text.value,
                  threadId: runResult.thread_id,
                  domainId: 'andorraEU',
                  createdAt: new Date()
                },
              ],
            });

            console.log({ result });
            // Aquí puedes realizar acciones adicionales con el último mensaje
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  );
}
