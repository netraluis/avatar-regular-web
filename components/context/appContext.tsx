"use client"; // Este archivo debe ser un cliente porque usará hooks
import { createContext, useContext, useReducer } from "react";

import { Assistant } from "@prisma/client";
import { UserData } from "@/types/types";
import { Team } from "@prisma/client";
import { GetTeamByTeamId } from "@/lib/data/team";

type AppState = {
  teams: Team[];
  teamSelected: GetTeamByTeamId | null;
  assistantsByTeam: Assistant[];
  user: UserData | null;
};

// Acciones que el reducer manejará
type Action =
  | {
      type: "SET_TEAMS";
      payload: {
        teams: Team[];
        teamSelected: GetTeamByTeamId | null;
      };
    }
  | { type: "SET_TEAM_SELECTED"; payload: GetTeamByTeamId | null }
  | {
      type: "SET_ASSISTANTS";
      payload: {
        assistants: Assistant[];
        teamSelected: GetTeamByTeamId | null;
      };
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
    case "SET_TEAM_DELETE":
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.payload.teamId),
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
  user: UserData | null;
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
