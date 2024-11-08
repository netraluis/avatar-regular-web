"use client";
import { Prisma } from "@prisma/client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface TeamSettingsContextProps {
  data: Prisma.TeamUpdateInput;
  setData: (data: Prisma.TeamUpdateInput) => void;
}

export const TeamSettingsContext = createContext<TeamSettingsContextProps>({
  data: {},
  setData: () => {},
});

export const useTeamSettingsContext = () => {
  const context = useContext(TeamSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useEstadoTeamSettings must be used within a EstadoTeamSettingsProvider",
    );
  }
  return context;
};

export const TeamSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Prisma.TeamUpdateInput>({});

  const value = {
    data,
    setData,
  };

  return (
    <TeamSettingsContext.Provider value={value}>
      {children}
    </TeamSettingsContext.Provider>
  );
};
