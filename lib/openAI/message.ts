import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que la clave no sea pública
});

export const createMessage = async ({
  threadId,
  message,
}: {
  threadId: string;
  message: string;
}): Promise<OpenAI.Beta.Threads.Messages.Message> => {
  return await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
};
