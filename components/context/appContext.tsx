// context/AppContext.tsx
"use client"; // Este archivo debe ser un cliente porque usará hooks

import { createContext, useContext, useState } from "react";

type Team = {
  id: string;
  name: string;
  subDomain: string;
  customDomain: string;
};

type Assistant = {
  id: string;
  name: string;
  status: string;
};

type AppContextType = {
  teams: Team[] | null;
  setTeams: (teams: Team[]) => void;
  teamSelected: Team | null;
  setTeamSelected: (team: Team) => void;
  assistantsByTeam: Assistant[];
  setAssistantsByTeam: (assistants: Assistant[]) => void;
};

// Crear el contexto con un valor inicial vacío
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor de equipos que rodeará la aplicación
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [teamSelected, setTeamSelected] = useState<Team | null>(null);
  const [assistantsByTeam, setAssistantsByTeam] = useState<Assistant[]>([]);

  return (
    <AppContext.Provider
      value={{
        teams,
        setTeams,
        teamSelected,
        setTeamSelected,
        assistantsByTeam,
        setAssistantsByTeam,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useTeams debe ser usado dentro de TeamsProvider");
  }
  return context;
};

export const useFetchAssistantsByTeamId = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);

  async function fetchAssistantsByTeamId(teamId: string) {
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
      setData(responseData);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, fetchAssistantsByTeamId };
};
