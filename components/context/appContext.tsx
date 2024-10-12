// context/AppContext.tsx
"use client"; // Este archivo debe ser un cliente porque usará hooks

import { createContext, useContext, useState } from "react";

export type Team = {
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
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  teamSelected: Team | null;
  setTeamSelected: (team: Team | null) => void;
  assistantsByTeam: Assistant[];
  setAssistantsByTeam: (assistants: Assistant[]) => void;
  user: any;
};

// Crear el contexto con un valor inicial vacío
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor de equipos que rodeará la aplicación
export const AppProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSelected, setTeamSelected] = useState<Team | null>(null);
  const [assistantsByTeam, setAssistantsByTeam] = useState<Assistant[]>([]);

  return (
    <AppContext.Provider
      value={{
        user,
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

export const useFetchTeamsByUserId = () => {
  const [loadingTeamsByUserId, setLoadingTeamsByUserId] = useState(false);
  const [errorTeamsByUserId, setErrorTeamsByUserId] = useState<any>(null);
  const [dataTeamsByUserId, setDataTeamsByUserId] = useState<Team[]>([]);

  async function fetchTeamsByUserId(userId: string) {
    if (!userId) return setErrorTeamsByUserId("No team id provided");
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

export const useCreateTeam = () => {
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
      console.log({ responseData });
      setCreateTeamData(responseData);
    } catch (error: any) {
      setErrorCreateTeam({ error });
    } finally {
      setLoadingCreateTeam(false);
    }
  }

  return { loadingCreateTeam, errorCreateTeam, createTeamData, createTeam };
};
