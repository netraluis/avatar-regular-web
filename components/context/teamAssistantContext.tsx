"use client";
import { GetTeamDataByDomainOrCustomDomainPage } from "@/lib/data/domain";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface TeamAssistantContextProps {
  data: GetTeamDataByDomainOrCustomDomainPage;
  setData: (data: GetTeamDataByDomainOrCustomDomainPage) => void;
}

export const TeamAssistantContext = createContext<TeamAssistantContextProps>({
  data: null,
  setData: () => {},
});

export const useTeamAssistantContext = () => {
  const context = useContext(TeamAssistantContext);
  if (context === undefined) {
    throw new Error(
      "useEstadoTeamAssistant must be used within a EstadoTeamAssistantProvider",
    );
  }
  return context;
};

interface TeamAssistantProviderProps {
  children: ReactNode;
  initialData: GetTeamDataByDomainOrCustomDomainPage; // Prop para el valor inicial
}

export const TeamAssistantProvider = ({
  children,
  initialData,
}: TeamAssistantProviderProps) => {
  const [data, setData] =
    useState<GetTeamDataByDomainOrCustomDomainPage>(initialData);

  const value = {
    data,
    setData,
  };

  return (
    <TeamAssistantContext.Provider value={value}>
      {children}
    </TeamAssistantContext.Provider>
  );
};
