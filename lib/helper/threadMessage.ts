import OpenAI from "openai";
import { FileCitationAnnotation } from "openai/resources/beta/threads/messages.mjs";
import { createMessage } from "../data/message";
import { ModeMessageType, RoleUserType } from "@prisma/client";

export type AssistantEventType = OpenAI.Beta.Assistants.AssistantStreamEvent | { event: 'timeout' } | { event: 'error_streaming' };

export const commonOnEvent = async (
  event: AssistantEventType,
  controller: ReadableStreamDefaultController<any>,
  assistantId: string,
  mode: ModeMessageType,
  message?: string,
) => {
  const eventText = JSON.stringify(event);
  controller.enqueue(new TextEncoder().encode(eventText + "\n"));

  if (event.event === "thread.run.completed") {
    // console.log(event.data.usage?.total_tokens);
    // console.log(event.data);
  }
  if (event.event === "thread.message.completed") {
    if (event.data.content[0].type === "text") {
      const { value, annotations } = event.data.content[0].text;

      const textAnnotations: string[] = [];
      const idAnnotations = (annotations as FileCitationAnnotation[]).map(
        (file: FileCitationAnnotation) => {
          textAnnotations.push(file.text);
          return file.file_citation.file_id;
        },
      );

      if (message) {
        await createMessage({
          role: RoleUserType.USER,
          message: message,
          threadId: event.data.thread_id,
          filesId: [],
          runId: null,
          assistant: { connect: { id: assistantId } },
          mode,
        });
      }

      await createMessage({
        role: RoleUserType.ASSISTANT,
        message: value,
        threadId: event.data.thread_id,
        filesId: idAnnotations,
        runId: event.data.run_id,
        assistant: { connect: { id: assistantId } },
        mode,
      });
    }
  }
};
