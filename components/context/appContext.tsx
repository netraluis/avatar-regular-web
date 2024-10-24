// context/AppContext.tsx
"use client"; // Este archivo debe ser un cliente porque usará hooks

import OpenAI from "openai";
import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants.mjs";
import { createContext, useContext, useReducer, useState } from "react";

export type Team = {
  id?: string;
  name: string;
  subDomain: string;
  customDomain?: string;
};

type Assistant = {
  id: string;
  name: string;
  status: string;
  model: string;
  teamId: string;
  openAIId: string;
};

type AppState = {
  teams: Team[];
  teamSelected: Pick<Team, "id" | "name" | "subDomain"> | null;
  assistantsByTeam: Assistant[];
  user: any;
};

// Acciones que el reducer manejará
type Action =
  | {
      type: "SET_TEAMS";
      payload: {
        teams: Team[];
        teamSelected: Pick<Team, "id" | "name" | "subDomain"> | null;
      };
    }
  | { type: "SET_TEAM_SELECTED"; payload: Team | null }
  | {
      type: "SET_ASSISTANTS";
      payload: {
        assistants: Assistant[];
        teamSelected: Pick<Team, "id" | "name" | "subDomain"> | null;
      };
    }
  | { type: "SET_TEAM_CREATION"; payload: { newTeam: Team } }
  | { type: "SET_USER"; payload: any }
  | { type: "SET_ASSISTANT_CREATION"; payload: { newAssistant: Assistant } }
  | { type: "SET_ASSISTANT_DELETE"; payload: { assistantId: string } };

// Reducer que actualizará el estado basado en las acciones
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_TEAMS":
      return {
        ...state,
        teams: action.payload.teams,
        teamSelected: action.payload.teamSelected,
      };
    case "SET_TEAM_SELECTED":
      return { ...state, teamSelected: action.payload };
    case "SET_ASSISTANTS":
      return {
        ...state,
        assistantsByTeam: action.payload.assistants,
        teamSelected: action.payload.teamSelected,
      };
    case "SET_TEAM_CREATION":
      return { ...state, teams: [...state.teams, action.payload.newTeam] };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_ASSISTANT_CREATION":
      return {
        ...state,
        assistantsByTeam: [
          ...state.assistantsByTeam,
          action.payload.newAssistant,
        ],
      };
    case "SET_ASSISTANT_DELETE":
      return {
        ...state,
        assistantsByTeam: state.assistantsByTeam.filter(
          (assistant) => assistant.openAIId !== action.payload.assistantId,
        ),
      };
    default:
      return state;
  }
};

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export const AppProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  const initialState: AppState = {
    teams: [],
    teamSelected: null,
    assistantsByTeam: [],
    user,
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de AppProvider");
  }
  return context;
};

export const useFetchTeamsByUserId = () => {
  const { dispatch } = useAppContext();

  const [loadingTeamsByUserId, setLoadingTeamsByUserId] = useState(false);
  const [errorTeamsByUserId, setErrorTeamsByUserId] = useState<any>(null);
  const [dataTeamsByUserId, setDataTeamsByUserId] = useState<Team[]>([]);

  async function fetchTeamsByUserId(userId: string) {
    if (!userId) return setErrorTeamsByUserId("No user id provided");
    try {
      setLoadingTeamsByUserId(true);
      const response = await fetch(`/api/protected/team`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId, // Aquí enviamos el userId en los headers
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      const teamSelected = responseData.length > 0 ? responseData[0] : {};
      dispatch({
        type: "SET_TEAMS",
        payload: { teams: responseData, teamSelected },
      });
      setDataTeamsByUserId(responseData);
    } catch (error: any) {
      setErrorTeamsByUserId({ error });
    } finally {
      setLoadingTeamsByUserId(false);
    }
  }

  return {
    loadingTeamsByUserId,
    errorTeamsByUserId,
    dataTeamsByUserId,
    fetchTeamsByUserId,
  };
};

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

export const useCreateTeam = () => {
  const { dispatch } = useAppContext();

  const [loadingCreateTeam, setLoadingCreateTeam] = useState(false);
  const [errorCreateTeam, setErrorCreateTeam] = useState<any>(null);
  const [createTeamData, setCreateTeamData] = useState<Team | null>(null);

  async function createTeam({
    teamName,
    userId,
  }: {
    teamName: string;
    userId: string;
  }) {
    try {
      setLoadingCreateTeam(true);
      const response = await fetch(`/api/protected/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ teamName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({
        type: "SET_TEAM_CREATION",
        payload: { newTeam: responseData },
      });
      setCreateTeamData(responseData);
    } catch (error: any) {
      setErrorCreateTeam({ error });
    } finally {
      setLoadingCreateTeam(false);
    }
  }

  return { loadingCreateTeam, errorCreateTeam, createTeamData, createTeam };
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
      console.log({ responseData });
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
      console.log({ responseData });
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
  // const { dispatch } = useAppContext();

  const [loadingGetAssistant, setLoadingGetAssistant] = useState(false);
  const [errorGetAssistant, setErrorGetAssistant] = useState<any>(null);
  const [getAssistantData, setGetAssistantData] =
    useState<OpenAI.Beta.Assistants.Assistant | null>(null);

  async function getAssistant({
    assistantId,
    userId,
  }: {
    assistantId: string;
    userId: string;
  }) {
    console.log({ assistantId, userId });
    try {
      setLoadingGetAssistant(true);
      const response = await fetch(`/api/protected/assistant/${assistantId}`, {
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
      // console.log({ responseData });
      // dispatch({
      //   type: "SET_ASSISTANT_DELETE",
      //   payload: { assistantId },
      // });
      setGetAssistantData(responseData);
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
  // const { dispatch } = useAppContext();

  const [loadingUpdateAssistant, setLoadingUpdateAssistant] = useState(false);
  const [errorUpdateAssistant, setErrorUpdateAssistant] = useState<any>(null);
  const [updateAssistantData, setUpdateAssistantData] =
    useState<OpenAI.Beta.Assistants.Assistant | null>(null);

  async function updateAssistant({
    assistantId,
    userId,
    assistantUpdateParams,
  }: {
    assistantId: string;
    userId: string;
    assistantUpdateParams: AssistantUpdateParams;
  }) {
    console.log({ assistantId, userId, assistantUpdateParams });
    try {
      setLoadingUpdateAssistant(true);
      const response = await fetch(`/api/protected/assistant/${assistantId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(assistantUpdateParams),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      // console.log({ responseData });
      // dispatch({
      //   type: "SET_ASSISTANT_DELETE",
      //   payload: { assistantId },
      // });
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
  threadId,
  assistantId,
  userId,
}: {
  threadId: string | undefined;
  assistantId: string;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [messages, setMessages] = useState<
    { role: string; message: string; id: string }[]
  >([]);
  const [internatlThreadId, setInternalThreadId] = useState<string | undefined>(
    undefined,
  );

  const [status, setStatus] = useState<string>("");

  const submitMessage = async (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: crypto.randomUUID(), role: "user", message },
    ]);
    setLoading(true);
    try {
      if (!threadId) {
        const response = await fetch(`/api/protected/thread`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
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
                if (parsedEvent?.data?.delta?.content[0]?.text?.value) {
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
        await fetch(`/api/protected/thread/${threadId}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({ message }),
        });

        const response = await fetch(`/api/protected/thread/${threadId}/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({ assistantId }),
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
                if (parsedEvent?.data?.delta?.content[0]?.text?.value) {
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
    internatlThreadId,
    messages,
    status,
  };
};
