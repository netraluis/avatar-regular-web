// context/AppContext.tsx
"use client"; // Este archivo debe ser un cliente porque usará hooks

import { createContext, useContext, useState } from "react";

type Team = {
  id: string;
  name: string;
};

type AppContextType = {
  team: Team | null;
  setTeam: (teams: Team) => void;
};

// Crear el contexto con un valor inicial vacío
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor de equipos que rodeará la aplicación
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [team, setTeam] = useState<Team | null>(null);

  return (
    <AppContext.Provider value={{ team, setTeam }}>
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
