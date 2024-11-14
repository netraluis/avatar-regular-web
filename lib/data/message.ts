import { Message, Prisma } from "@prisma/client";
import prisma from "../prisma";

export const createMessage = async (message: Prisma.MessageCreateInput) => {
  return prisma.message.create({
    data: message,
  });
};

export const getPaginatedThreadsMessages = async ({
  assistantId,
  page,
  pageSize,
  limitMessagesPerThread,
  dateFrom,
  dateTo,
}: {
  assistantId: string;
  page: number;
  pageSize: number;
  limitMessagesPerThread: number;
  dateFrom: string | null;
  dateTo: string | null;
}): Promise<{ messages: Message[]; totalThreads: number }> => {
  const offset = (page - 1) * pageSize;

  try {
    let dateCondition = "";
    if (dateFrom)
      dateCondition += ` AND "createdAt" >= '${dateFrom.toString()}'`;
    if (dateTo) dateCondition += ` AND "createdAt" <= '${dateTo.toString()}'`;

    const results: any = await prisma.$queryRawUnsafe(`
        SELECT "threadId", "message", "role", "createdAt"
        FROM (
          SELECT "threadId", "message", "role", "createdAt",
                ROW_NUMBER() OVER (PARTITION BY "threadId" ORDER BY "createdAt") as row_num,
                DENSE_RANK() OVER (ORDER BY "threadId") as thread_rank
          FROM "Message"
          WHERE "assistantId" = '${assistantId}' ${dateCondition}
        ) subquery
        WHERE row_num <= ${limitMessagesPerThread}
          AND thread_rank > ${offset}
          AND thread_rank <= ${offset + pageSize}
        ORDER BY "threadId", "createdAt";
      `);

    const totalThreads: any = await prisma.$queryRawUnsafe(`
        SELECT COUNT(DISTINCT "threadId")::int AS total_threads
        FROM "Message"
        WHERE "assistantId" = '${assistantId}' ${dateCondition}
      `);


    // Extrae los mensajes y el total de threads desde los resultados.
    const messages = results.map((row: Message) => ({
      threadId: row.threadId,
      role: row.role,
      message: row.message,
      createdAt: row.createdAt,
    }));

    // const totalThreads =
    //   results.length > 0 ? Number(results[0].total_threads) : 0;

    return { messages, totalThreads: totalThreads[0].total_threads };
  } catch (error) {
    console.error(
      "Error ejecutando la consulta en getPaginatedThreadsMessages:",
      error,
    );
    throw error; // Opcionalmente puedes lanzar el error para que sea manejado en otro lugar
  }
};

export const getMessagesByThread = async ({
  threadId,
  assistantId,
}: {
  threadId: string;
  assistantId: string;
}) => {
  return prisma.message.findMany({
    where: {
      assistantId,
      threadId,
    },
  });
};
