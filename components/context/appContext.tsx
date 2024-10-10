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
  assistantsByTeam: Assistant[] | null;
  setAssistantsByTeam: (assistants: Assistant[]) => void;
};

// Crear el contexto con un valor inicial vacío
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor de equipos que rodeará la aplicación
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [teamSelected, setTeamSelected] = useState<Team | null>(null);
  const [assistantsByTeam, setAssistantsByTeam] = useState<Assistant[] | null>(
    null,
  );

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
