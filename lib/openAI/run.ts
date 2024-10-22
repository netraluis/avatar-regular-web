import OpenAI from "openai";

const openai = new OpenAI();

export const createRun = async ({
  assistantId,
  threadId,
  onEvent,
}: {
  assistantId: string;
  threadId: string;
  onEvent?: (event: OpenAI.Beta.Assistants.AssistantStreamEvent) => void;
}): Promise<void> => {
  const stream = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    stream: true,
  });

  for await (const event of stream) {
    if (onEvent) {
      onEvent(event);
    }
    // onEvent(event)
    // events.push(event);
  }
};

export const createThreadAndRun = async ({
  assistantId,
  message,
  onEvent,
}: {
  assistantId: string;
  message: string;
  onEvent?: (event: OpenAI.Beta.Assistants.AssistantStreamEvent) => void;
}): Promise<void> => {
  const stream = await openai.beta.threads.createAndRun({
    assistant_id: assistantId,
    thread: {
      messages: [{ role: "user", content: message }],
    },
    stream: true,
  });
  // const events: OpenAI.Beta.Assistants.AssistantStreamEvent[] = [];
  for await (const event of stream) {
    if (onEvent) {
      onEvent(event);
    }
    // onEvent(event)
    // events.push(event);
  }
  // return events;
};
