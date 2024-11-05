import { useState } from "react";
import { useAppContext } from "../appContext";
import { Assistant } from "@prisma/client";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";

export const useFetchAssistantsByTeamId = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);

  async function fetchAssistantsByTeamId(teamId: string, userId: string) {
    if (!teamId) return setError("No team id provided");
    try {
      setLoading(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      const teamSelectedResponse = await fetch(
        `/api/protected/team/${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId, // Aquí enviamos el userId en los headers
          },
        },
      );

      if (!teamSelectedResponse.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const teamSelected = await teamSelectedResponse.json();

      dispatch({
        type: "SET_ASSISTANTS",
        payload: { assistants: responseData, teamSelected },
      });

      setData(responseData);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, fetchAssistantsByTeamId };
};

export const useCreateAssistant = () => {
  const { dispatch } = useAppContext();

  const [loadingCreateAssistant, setLoadingCreateAssistant] = useState(false);
  const [errorCreateAssistant, setErrorCreateAssistant] = useState<any>(null);
  const [createAssistantData, setCreateAssistantData] =
    useState<Assistant | null>(null);

  async function createAssistant({
    assistantCreateParams,
    teamId,
    userId,
  }: {
    assistantCreateParams: AssistantCreateParams;
    teamId: string;
    userId: string;
  }) {
    try {
      setLoadingCreateAssistant(true);
      const response = await fetch(`/api/protected/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          assistantCreateParams,
          teamId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({
        type: "SET_ASSISTANT_CREATION",
        payload: { newAssistant: responseData },
      });
      setCreateAssistantData(responseData);
    } catch (error: any) {
      setErrorCreateAssistant({ error });
    } finally {
      setLoadingCreateAssistant(false);
    }
  }

  return {
    loadingCreateAssistant,
    errorCreateAssistant,
    createAssistantData,
    createAssistant,
  };
};

export const useDeleteAssistant = () => {
  const { dispatch } = useAppContext();

  const [loadingDeleteAssistant, setLoadingDeleteAssistant] = useState(false);
  const [errorDeleteAssistant, setErrorDeleteAssistant] = useState<any>(null);
  const [deleteAssistantData, setDeleteAssistantData] =
    useState<Assistant | null>(null);

  async function deleteAssistant({
    assistantId,
    userId,
  }: {
    assistantId: string;
    userId: string;
  }) {
    try {
      setLoadingDeleteAssistant(true);
      const response = await fetch(`/api/protected/assistant/${assistantId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({
        type: "SET_ASSISTANT_DELETE",
        payload: { assistantId },
      });
      setDeleteAssistantData(responseData);
    } catch (error: any) {
      setErrorDeleteAssistant({ error });
    } finally {
      setLoadingDeleteAssistant(false);
    }
  }

  return {
    loadingDeleteAssistant,
    errorDeleteAssistant,
    deleteAssistantData,
    deleteAssistant,
  };
};
