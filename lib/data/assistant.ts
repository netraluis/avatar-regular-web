import {
  createAssistant,
  deleteAssistantById,
  modifyAssistantById,
} from "../openAI/assistant";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import prisma from "../prisma";
import { createVectorStore } from "../openAI/vector-store";
import { Prisma } from "@prisma/client";

export const getAssistantsByTeam = async (teamId: string) => {
  const teamInfo = await prisma.assistant.findMany({
    where: {
      teamId: teamId,
      isActive: true,
    },
  });
  return teamInfo;
};

export const createAssistantByTeam = async (
  teamId: string,
  url: string,
  assistantCreateParams: AssistantCreateParams,
) => {
  if (!assistantCreateParams.name) {
    throw new Error("name is required");
  }
  const newAssistantOpenAi = await createAssistant({
    name: assistantCreateParams.name,
    model: assistantCreateParams.model,
  });

  const newVectorStoreFile = await createVectorStore({
    name: newAssistantOpenAi.id,
  });

  const newAssistant = await prisma.assistant.create({
    data: {
      name: assistantCreateParams.name,
      teamId: teamId,
      openAIId: newAssistantOpenAi.id,
      openAIVectorStoreFileId: newVectorStoreFile.id,
      url: url,
    },
  });

  const newFileAssistant = await modifyAssistantById(newAssistant.openAIId, {
    tools: [
      {
        type: "file_search",
      },
    ],
    tool_resources: {
      file_search: {
        vector_store_ids: [newVectorStoreFile.id],
      },
    },
  });

  return { ...newFileAssistant, ...newAssistant };
};

export const deleteAssistant = async (assistantId: string) => {
  const assistant = await prisma.assistant.update({
    where: {
      id: assistantId,
    },
    data: {
      isActive: false,
      url: `${assistantId}-deleted`,
    },
  });
  await deleteAssistantById(assistant.openAIId);
  return assistant;
};

export type GetAssistantType = Prisma.AssistantGetPayload<{
  include: { assistantCard: true };
}> | null;

export const getAssistant = async (
  assistantId: string,
): Promise<GetAssistantType> => {
  return await prisma.assistant.findUnique({
    where: {
      id: assistantId,
      isActive: true,
    },
    include: {
      assistantCard: true,
    },
  });
};

export const updateAssistant = async (
  assistantId: string,
  data: Prisma.AssistantUpdateInput,
): Promise<GetAssistantType> => {
  return await prisma.assistant.update({
    where: {
      id: assistantId,
      isActive: true,
    },
    data,
    include: {
      assistantCard: true,
    },
  });
};
