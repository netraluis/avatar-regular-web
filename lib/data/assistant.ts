import {
  createAssistant,
  deleteAssistantById,
  modifyAssistantById,
} from "../openAI/assistant";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import prisma from "../prisma";
import { createVectorStore } from "../openAI/vector-store";
import { Prisma, Assistant } from "@prisma/client";

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

  const newVectorStoreFile = await createVectorStore({
    name: newAssistantOpenAi.id,
  });

  const newAssistant = await prisma.assistant.create({
    data: {
      name: assistantCreateParams.name,
      teamId: teamId,
      openAIId: newAssistantOpenAi.id,
      openAIVectorStoreFileId: newVectorStoreFile.id,
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
  const assistant = await prisma.assistant.delete({
    where: {
      id: assistantId,
    },
  });
  await deleteAssistantById(assistant.openAIId);
  return assistant;
};

export const getAssistant = async (
  assistantId: string,
): Promise<Assistant | null> => {
  return await prisma.assistant.findUnique({
    where: {
      id: assistantId,
    },
  });
};

export const updateAssistant = async (
  assistantId: string,
  data: Prisma.AssistantUpdateInput,
) => {
  return await prisma.assistant.update({
    where: {
      id: assistantId,
    },
    data,
  });
};
