import OpenAI from "openai";
import { AssistantEventType } from "../helper/threadMessage";
import { Stream } from "openai/streaming.mjs";

const openai = new OpenAI();

const runHandler = async ({
  stream,
  onEvent,
}: {
  stream: Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>;
  onEvent?: (event: AssistantEventType) => void;
}) => {
  // Agregar timeout para el loop del stream
  const TIMEOUT = 45000; // 45 segundos
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    console.warn("Stream timed out. Aborting...");
  }, TIMEOUT);

  // Función para simular retardos
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  // const events: OpenAI.Beta.Assistants.AssistantStreamEvent[] = [];
  try {
    for await (const event of stream) {
      if (timedOut) {
        console.warn("Exiting stream loop due to timeout.");
        if (onEvent) {
          onEvent({ event: "timeout" });
        }
        break; // Salir del loop si el timeout se alcanzó
      }

      // BORRAR: Simular un delay de 500ms
      await sleep(500);
      if (onEvent) {
        onEvent(event);
      }
      // onEvent(event)
      // events.push(event);
    }
  } catch (error) {
    console.error("Error in createThreadAndRun:", error);
    throw error; // Propagar el error para que sea manejado por el `catch` en `POST`
  } finally {
    clearTimeout(timeoutId); // Limpiar el timeout cuando finalice el stream
  }
};

export const createRun = async ({
  assistantId,
  threadId,
  onEvent,
}: {
  assistantId: string;
  threadId: string;
  onEvent?: (event: AssistantEventType) => void;
}): Promise<void> => {
  const stream = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    stream: true,
  });

  await runHandler({ stream, onEvent });

};

export const createThreadAndRun = async ({
  assistantId,
  message,
  onEvent,
}: {
  assistantId: string;
  message: string;
  onEvent?: (event: AssistantEventType) => void;
}): Promise<void> => {
  const stream = await openai.beta.threads.createAndRun({
    assistant_id: assistantId,
    thread: {
      messages: [{ role: "user", content: message }],
    },
    stream: true,
  });

  await runHandler({ stream, onEvent });

  // return events;
};
