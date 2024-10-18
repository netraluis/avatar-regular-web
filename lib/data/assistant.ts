import { createAssistant, deleteAssistantById } from "../openAI/assistant";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import prisma from "../prisma";

export const getAssistantsByTeam = async (teamId: string) => {
  const teamInfo = await prisma.assistant.findMany({
    where: {
      teamId: teamId,
    },
  });
  return teamInfo;
};

export const createAssistantByTeam = async (
  teamId: string,
  assistantCreateParams: AssistantCreateParams,
) => {
  if (!assistantCreateParams.name) {
    throw new Error("name is required");
  }
  const newAssistantOpenAi = await createAssistant({
    name: assistantCreateParams.name,
    model: assistantCreateParams.model,
  });
  const newAssistant = await prisma.assistant.create({
    data: {
      name: assistantCreateParams.name,
      teamId: teamId,
      openAIId: newAssistantOpenAi.id,
    },
  });

  return newAssistant;
};

export const deleteAssistant = async (assistantId: string) => {
  await deleteAssistantById(assistantId);
  const assistant = await prisma.assistant.delete({
    where: {
      openAIId: assistantId,
    },
  });
  return assistant;
};
