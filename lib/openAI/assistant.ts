import OpenAI from "openai";
import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que la clave no sea pública
});

export const createAssistant = async (
  input: AssistantCreateParams,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  return await openai.beta.assistants.create(input);
};
export const getAssistantById = async (
  assistantId: string,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  return await openai.beta.assistants.retrieve(assistantId);
};

export const modifyAssistantById = async (
  assistantId: string,
  body: AssistantUpdateParams,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  return await openai.beta.assistants.update(assistantId, body);
};

export const deleteAssistantById = async (
  assistantId: string,
): Promise<OpenAI.Beta.Assistants.AssistantDeleted> => {
  return await openai.beta.assistants.del(assistantId);
};
