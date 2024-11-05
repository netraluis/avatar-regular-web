// context/AppContext.tsx
"use client"; // Este archivo debe ser un cliente porque usará hooks

import { VectorStoreFile, SuccessfullResponse } from "@/types/types";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants.mjs";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { Assistant, FileType, Team } from "@prisma/client";

// export type Team = {
//   id?: string;
//   name: string;
//   subDomain: string;
//   customDomain?: string;
// };

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
  | { type: "SET_ASSISTANT_DELETE"; payload: { assistantId: string } }
  | { type: "SET_USER_LOGOUT" };

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
          (assistant) => assistant.id !== action.payload.assistantId,
        ),
      };
    case "SET_USER_LOGOUT":
      return {
        ...state,
        teams: [],
        teamSelected: null,
        assistantsByTeam: [],
        user: null,
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
  const router = useRouter();

  const initialState: AppState = {
    teams: [],
    teamSelected: null,
    assistantsByTeam: [],
    user: { user: { id: user } },
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.user?.user?.id) {
      // return router.push("/team");
    } else {
      return router.push("/login");
    }
  }, [state.user?.user?.id]);

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

export const useUserLogout = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  async function userLogout() {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/signout`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({ type: "SET_USER_LOGOUT" });
      setData(responseData);
      return { data: responseData };
    } catch (error: any) {
      setError({ error });
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, userLogout };
};

export const useLoginUser = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  async function loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({ type: "SET_USER", payload: responseData });
      setData(responseData);
      return { data: responseData };
    } catch (error: any) {
      setError({ error });
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, loginUser };
};

export const useFileVectorStoreAssistant = () => {
  const [upLoadFileloading, setUpLoadFileloading] = useState(false);
  const [upLoadFileError, setUpLoadFileError] = useState<any>(null);
  const [upLoadFiledata, setUpLoadFiledata] = useState<any>(null);

  const [getFileloading, setGetFileloading] = useState(false);
  const [getFileError, setGetFileError] = useState<any>(null);
  const [getFileData, setGetFiledata] = useState<
    SuccessfullResponse<VectorStoreFile[]>
  >({ status: 200, data: [] });

  const [fileData, setFileData] = useState<VectorStoreFile[]>([]);

  async function uploadFileVectorStore({
    fileInput,
    assistantId,
    fileType,
  }: {
    fileInput: FileList | null;
    assistantId: string;
    fileType: FileType;
  }) {
    if (!fileInput || fileInput.length === 0) return;
    try {
      setUpLoadFileloading(true);

      const upLoadingFile: any[] = [
        ...Array.from(fileInput).map((file) => {
          return {
            filename: file.name,
            isCharging: true,
            status: "loading",
          };
        }),
      ];

      setFileData((prev) => [...prev, ...upLoadingFile]);
      const formData = new FormData();
      Array.from(fileInput).forEach((file) => {
        formData.append("files", file); // Usa el mismo nombre "files" para todos los archivos
      });

      formData.append("assistantId", assistantId);
      formData.append("purpose", "assistants");

      const requestOptions = { method: "POST", body: formData };

      const response = await fetch(
        `/api/protected/file/file-type/${fileType}`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      setUpLoadFileError(null);
      setUpLoadFiledata(responseData);
      console.log({ responseData });
      setFileData((prev) => prev.filter((file) => !file.isCharging));
      return setFileData((prev) => [
        ...prev.filter((file) => !file.isCharging),
        ...responseData.data,
      ]);
    } catch (error: any) {
      return setUpLoadFileError({ error });
    } finally {
      setUpLoadFileloading(false);
    }
  }

  async function getFileVectorStore({
    assistantId,
    fileType,
  }: {
    assistantId: string;
    fileType: FileType;
  }) {
    try {
      setGetFileloading(true);
      const response = await fetch(
        `/api/protected/file/file-type/${fileType}/${assistantId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData: SuccessfullResponse<VectorStoreFile[]> =
        await response.json();
      setGetFiledata(responseData);
      console.log("GET", { responseData });
      return setFileData(responseData.data);
    } catch (error: any) {
      return setGetFileError({ error });
    } finally {
      setGetFileloading(false);
    }
  }

  async function deleteFileVectorStore({ fileId }: { fileId: string }) {
    try {
      setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: true };
          }
          return file;
        });
        return res;
      });
      const response = await fetch(`/api/protected/file/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return setFileData((pre) => pre.filter((file) => file.id !== fileId));
    } catch (error: any) {
      return setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: false, status: "error" };
          }
          return file;
        });
        return res;
      });
    } finally {
      setFileData((pre) => {
        const res = pre.map((file) => {
          if (file.id === fileId) {
            return { ...file, isCharging: false };
          }
          return file;
        });
        return res;
      });
    }
  }

  return {
    upLoadFileloading,
    upLoadFileError,
    upLoadFiledata,
    uploadFileVectorStore,
    getFileloading,
    getFileError,
    getFileData,
    getFileVectorStore,
    deleteFileVectorStore,
    fileData,
  };
};
