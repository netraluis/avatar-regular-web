"use client"; // Este archivo debe ser un cliente porque usará hooks
import { createContext, useContext, useReducer } from "react";

import { Assistant, User } from "@prisma/client";
import { UserData } from "@/types/types";
import { Team } from "@prisma/client";
import { GetTeamByTeamId } from "@/lib/data/team";
import OpenAI from "openai";
import { GetAssistantType } from "@/lib/data/assistant";

export interface Teams {
  teams: Team[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

type AppState = {
  teams: Teams;
  teamSelected: GetTeamByTeamId | null;
  assistantsByTeam: Assistant[];
  assistantSelected: {
    localAssistant: GetAssistantType;
    openAIassistant: OpenAI.Beta.Assistants.Assistant;
  } | null;
  user: UserData | null;
  userLocal: User | null;
  loading: boolean;
};

// Acciones que el reducer manejará
type Action =
  | {
      type: "SET_TEAMS";
      payload: Teams;
    }
  | { type: "SET_TEAM_SELECTED"; payload: GetTeamByTeamId | null }
  | {
      type: "SET_ASSISTANTS";
      payload: {
        assistants: Assistant[];
      };
    }
  | {
      type: "SET_ASSISTANT";
      payload: {
        localAssistant: GetAssistantType;
        openAIassistant: OpenAI.Beta.Assistants.Assistant;
      } | null;
    }
  | { type: "SET_TEAM_CREATION"; payload: { newTeam: any } }
  | { type: "SET_TEAM_DELETE"; payload: { teamId: string } }
  | { type: "SET_USER"; payload: UserData }
  | { type: "SET_ASSISTANT_CREATION"; payload: { newAssistant: Assistant } }
  | { type: "SET_ASSISTANT_DELETE"; payload: { assistantId: string } }
  | { type: "SET_USER_LOGOUT" }
  | {
      type: "SET_TEAM";
      payload: {
        teamSelected: GetTeamByTeamId | null;
      };
    }
  | { type: "SET_USER_LOCAL"; payload: User | null }
  | {
      type: "SET_LOADING";
      payload: {
        loading: boolean;
      };
    };

// Reducer que actualizará el estado basado en las acciones
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_TEAM":
      return {
        ...state,
        teamSelected: action.payload.teamSelected,
      };

    case "SET_TEAMS":
      return {
        ...state,
        teams: { teams: action.payload.teams, meta: action.payload.meta },
      };
    case "SET_TEAM_SELECTED":
      return { ...state, teamSelected: action.payload };
    case "SET_ASSISTANTS":
      return {
        ...state,
        assistantsByTeam: action.payload.assistants,
      };
    case "SET_ASSISTANT":
      if (action.payload && action.payload.localAssistant) {
        return {
          ...state,
          assistantSelected: action.payload,
          assistantsByTeam: state.assistantsByTeam.map((assistant) =>
            action.payload &&
            action.payload.localAssistant &&
            assistant.id === action.payload.localAssistant.id
              ? {
                  ...assistant,
                  id: action.payload.localAssistant.id,
                  name: action.payload.localAssistant.name,
                  teamId: action.payload.localAssistant.teamId,
                  status: action.payload.localAssistant.status,
                  openAIId: action.payload.localAssistant.openAIId,
                  openAIVectorStoreFileId:
                    action.payload.localAssistant.openAIVectorStoreFileId,
                  notionAccessToken:
                    action.payload.localAssistant.notionAccessToken,
                  avatarId: action.payload.localAssistant.avatarId,
                  createdAt: action.payload.localAssistant.createdAt,
                  updatedAt: action.payload.localAssistant.updatedAt,
                  url: action.payload.localAssistant.url,
                  emoji: action.payload.localAssistant.emoji,
                  isActive: action.payload.localAssistant.isActive,
                }
              : assistant,
          ),
        };
      }
      return {
        ...state,
        assistantSelected: action.payload,
      };

    case "SET_TEAM_CREATION":
      return { ...state };
    case "SET_TEAM_DELETE":
      return {
        ...state,
        // teams: state.teams.filter((team) => team.id !== action.payload.teamId),
      };
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
        teams: {
          teams: [],
          meta: { total: 0, page: 0, pageSize: 0, totalPages: 0 },
        },
        teamSelected: null,
        assistantsByTeam: [],
        user: null,
      };

    case "SET_USER_LOCAL":
      return {
        ...state,
        userLocal: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload.loading,
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
  userLocal,
}: {
  children: React.ReactNode;
  user: UserData;
  userLocal: User | null;
}) => {
  const initialState: AppState = {
    teams: {
      teams: [],
      meta: { total: 0, page: 0, pageSize: 0, totalPages: 0 },
    },
    teamSelected: null,
    assistantsByTeam: [],
    assistantSelected: null,
    user,
    userLocal,
    loading: false,
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
