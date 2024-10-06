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
    assistantId: string;
    domainId: string;
  } = await req.json();

  // Create a thread if needed and save it to the database
  const { threadId } = await manageThreadId(input);

  // Add a message to the thread
  await openai.beta.threads.messages.create(threadId, {
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
          domainId: input.domainId,
          createdAt: new Date(),
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }

  return AssistantResponse(
    { threadId, messageId: crypto.randomUUID() },
    async ({ sendMessage }) => {
      try {
        // Run the assistant on the thread
        const runStream: any = openai.beta.threads.runs.stream(threadId, {
          assistant_id:
            input.assistantId ??
            (() => {
              throw new Error("ASSISTANT_ID is not set");
            })(),
        });

        let accumulatedMessage = ""; // Variable para acumular los fragmentos de texto
        for await (const chunk of runStream) {
          const newContent = chunk.data?.delta?.content ?? ""; // Extrae el fragmento de texto

          if (newContent) {
            // Opcional: puedes manipular o procesar el texto antes de enviarlo
            const newMessage = newContent[0]?.text?.value ?? "";
            // console.log("Nuevo fragmento recibido:", newMessage);
            // [ { index: 0, type: 'text', text: { value: ' nou' } } ]

            accumulatedMessage += newMessage;

            // // Enviar fragmento al cliente (asumiendo que `sendMessage` es parte del SDK)
            sendMessage({
              id: chunk.data.id,
              role: "assistant",
              content: [{ type: "text", text: { value: newMessage } }],
            });
          }
        }

        await prisma.messages.createMany({
          data: [
            {
              role: "assistant",
              message: accumulatedMessage,
              threadId,
              domainId: input.domainId,
              createdAt: new Date(),
            },
          ],
        });
      } catch (e) {
        console.error(e);
      }

      // forward run status would stream message deltas
      // const runResult = await forwardStream(runStream);
      // console.log({runResult});
      // if (
      //   runResult &&
      //   runResult.status === "completed" &&
      //   runResult.thread_id
      // ) {
      //   const threadMessages: any = await openai.beta.threads.messages.list(
      //     runResult.thread_id,
      //     {
      //       order: "desc",
      //     },
      //   );

      //   try {
      //     if (threadMessages.data.length > 1) {
      //       const lastResponse = threadMessages.data[0]; // El primer mensaje en la lista ordenada es el más reciente

      //       await prisma.messages.createMany({
      //         data: [
      //           {
      //             role: lastResponse.role,
      //             message: lastResponse.content[0].text.value,
      //             threadId: runResult.thread_id,
      //             domainId: input.domainId,
      //             createdAt: new Date(),
      //           },
      //         ],
      //       });
      //     }
      //   } catch (e) {
      //     console.error(e);
      //   }
      // }
    },
  );
}
