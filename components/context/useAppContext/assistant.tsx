import { Dispatch, SetStateAction, useState } from "react";
import { useAppContext } from "../appContext";
import { Assistant, Prisma } from "@prisma/client";
import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants.mjs";
import OpenAI from "openai";
import { GetAssistantType } from "@/lib/data/assistant";

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
    url,
    userId,
  }: {
    assistantCreateParams: AssistantCreateParams;
    teamId: string;
    url: string;
    userId: string;
  }) {
    try {
      setLoadingCreateAssistant(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          assistantCreateParams,
          teamId,
          url,
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
    teamId,
    assistantId,
    userId,
  }: {
    teamId: string;
    assistantId: string;
    userId: string;
  }) {
    try {
      setLoadingDeleteAssistant(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants/${assistantId}`, {
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

export const useGetAssistant = () => {
  const [loadingGetAssistant, setLoadingGetAssistant] = useState(false);
  const [errorGetAssistant, setErrorGetAssistant] = useState<any>(null);
  const [getAssistantData, setGetAssistantData] = useState<{
    openAIassistant: OpenAI.Beta.Assistants.Assistant;
    localAssistant: GetAssistantType;
  } | null>(null);

  async function getAssistant({
    assistantId,
    userId,
    teamId
  }: {
    assistantId: string;
    teamId: string;
    userId: string;
  }) {
    try {
      setLoadingGetAssistant(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants/${assistantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      setGetAssistantData(responseData);
      return responseData;
    } catch (error: any) {
      setErrorGetAssistant({ error });
    } finally {
      setLoadingGetAssistant(false);
    }
  }

  return {
    loadingGetAssistant,
    errorGetAssistant,
    getAssistantData,
    getAssistant,
  };
};

export const useUpdateAssistant = () => {
  const [loadingUpdateAssistant, setLoadingUpdateAssistant] = useState(false);
  const [errorUpdateAssistant, setErrorUpdateAssistant] = useState<any>(null);
  const [updateAssistantData, setUpdateAssistantData] = useState<{
    openAIassistantUpdateParams: OpenAI.Beta.Assistants.Assistant;
    localAssistantUpdateParams: Assistant;
  } | null>(null);

  async function updateAssistant({
    assistantId,
    userId,
    openAIassistantUpdateParams,
    localAssistantUpdateParams,
    teamId,
  }: {
    teamId: string;
    assistantId: string;
    userId: string;
    openAIassistantUpdateParams?: AssistantUpdateParams;
    localAssistantUpdateParams: Prisma.AssistantUpdateInput;
  }) {
    try {
      setLoadingUpdateAssistant(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants/${assistantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          openAIassistantUpdateParams,
          localAssistantUpdateParams,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      setUpdateAssistantData(responseData);
    } catch (error: any) {
      setErrorUpdateAssistant({ error });
    } finally {
      setLoadingUpdateAssistant(false);
    }
  }

  return {
    loadingUpdateAssistant,
    errorUpdateAssistant,
    updateAssistantData,
    updateAssistant,
  };
};

export const useAssistant = ({
  assistantId,
  userId,
  teamId
}: {
  teamId: string;
  assistantId: string | undefined;
  userId: string | undefined;
}): UseAssistantResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [messages, setMessages] = useState<
    { role: string; message: string; id: string }[]
  >([]);
  const [internatlThreadId, setInternalThreadId] = useState<string | undefined>(
    undefined,
  );

  const [status, setStatus] = useState<string>("thread.run.completed");

  if (!assistantId) {
    return {
      loading: false,
      error: false,
      data: [],
      submitMessage: () => {},
      messages: [],
      status: "",
      setInternalThreadId,
      setMessages,
    };
  }

  const headers: HeadersInit = userId
    ? { "Content-Type": "application/json", "x-user-id": userId }
    : { "Content-Type": "application/json" };

  const submitMessage = async (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: crypto.randomUUID(), role: "user", message },
    ]);
    setLoading(true);
    try {
      console.log({ internatlThreadId, message, assistantId });
      if (!internatlThreadId) {
        
        const response = await fetch(`/api/protected/team/${teamId}/assistants/${assistantId}/thread/`, {
          method: "POST",
          headers,
          body: JSON.stringify({ message, assistantId }),
        });

        if (!response.body) {
          throw new Error("No response stream found");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // Buffer para acumular los fragmentos
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          // Decodificamos el fragmento recibido
          buffer += decoder.decode(value, { stream: true });

          // Dividimos el buffer en líneas por el delimitador \n
          const lines = buffer.split("\n");
          // Guardamos la última parte que puede estar incompleta en el buffer
          buffer = lines.pop() || "";

          // Procesamos cada línea que contiene un JSON completo
          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsedEvent = JSON.parse(line); // Parseamos solo líneas completas
                setStatus(parsedEvent.event);
                setData((prevData) => [...prevData, parsedEvent]); // Actualizamos el estado con el evento
                if (parsedEvent.event === "thread.created") {
                  setInternalThreadId(parsedEvent.data.id);
                }
                if (
                  parsedEvent?.data?.delta?.content &&
                  parsedEvent?.data?.delta?.content[0]?.text?.value
                ) {
                  const message =
                    parsedEvent?.data?.delta?.content[0]?.text?.value;
                  const id = parsedEvent?.data?.id;

                  setMessages((prevMessages) => {
                    const existingMessageIndex = prevMessages.findIndex(
                      (msg) => msg.id === id,
                    );

                    if (existingMessageIndex !== -1) {
                      // Sobrescribir el mensaje acumulado
                      const updatedMessages = [...prevMessages];
                      updatedMessages[existingMessageIndex] = {
                        message:
                          updatedMessages[existingMessageIndex].message +
                          message,
                        role: updatedMessages[existingMessageIndex].role,
                        id: updatedMessages[existingMessageIndex].id,
                      };
                      return updatedMessages;
                    } else {
                      // Si es un nuevo mensaje, añadirlo a la lista
                      // if(lastMessage.role === "user") return prevMessages
                      return [
                        ...prevMessages,
                        { id, role: "assistant", message },
                      ];
                    }
                  });
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      } else {
        await fetch(
          `/api/protected/team/${teamId}/assistants/${assistantId}/thread/${internatlThreadId}/message`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ message }),
          },
        );

        const response = await fetch(
          `/api/protected/team/${teamId}/assistants/${assistantId}/thread/${internatlThreadId}/run`,
          {
            method: "POST",
            headers,
          },
        );

        if (!response.body) {
          throw new Error("No response stream found");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ""; // Buffer para acumular los fragmentos
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          // Decodificamos el fragmento recibido
          buffer += decoder.decode(value, { stream: true });

          // Dividimos el buffer en líneas por el delimitador \n
          const lines = buffer.split("\n");
          // Guardamos la última parte que puede estar incompleta en el buffer
          buffer = lines.pop() || "";

          // Procesamos cada línea que contiene un JSON completo
          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsedEvent = JSON.parse(line); // Parseamos solo líneas completas
                setStatus(parsedEvent.event);
                setData((prevData) => [...prevData, parsedEvent]); // Actualizamos el estado con el evento
                if (
                  parsedEvent?.data?.delta?.content &&
                  parsedEvent?.data?.delta?.content[0]?.text?.value
                ) {
                  const message =
                    parsedEvent?.data?.delta?.content[0]?.text?.value;
                  const id = parsedEvent?.data?.id;

                  setMessages((prevMessages) => {
                    const existingMessageIndex = prevMessages.findIndex(
                      (msg) => msg.id === id,
                    );

                    if (existingMessageIndex !== -1) {
                      // Sobrescribir el mensaje acumulado
                      const updatedMessages = [...prevMessages];
                      updatedMessages[existingMessageIndex] = {
                        message:
                          updatedMessages[existingMessageIndex].message +
                          message,
                        role: updatedMessages[existingMessageIndex].role,
                        id: updatedMessages[existingMessageIndex].id,
                      };
                      return updatedMessages;
                    } else {
                      // Si es un nuevo mensaje, añadirlo a la lista
                      // if(lastMessage.role === "user") return prevMessages
                      return [
                        ...prevMessages,
                        { id, role: "assistant", message },
                      ];
                    }
                  });
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        }
      }
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    submitMessage,
    messages,
    status,
    setInternalThreadId,
    setMessages,
  };
};

export interface UseAssistantResponse {
  loading: boolean;
  error: any;
  data: any[];
  submitMessage: (message: string) => void;
  messages: { role: string; message: string; id: string }[];
  status: string;
  setInternalThreadId: Dispatch<SetStateAction<string | undefined>>;
  setMessages: Dispatch<
    SetStateAction<
      {
        role: string;
        message: string;
        id: string;
      }[]
    >
  >;
}
