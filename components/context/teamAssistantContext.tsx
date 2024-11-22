"use client";
import { GetTeamDataByDomainOrCustomDomainPage } from "@/lib/data/domain";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useAssistant, UseAssistantResponse } from "./useAppContext/assistant";

interface TeamAssistantContextProps {
  data: GetTeamDataByDomainOrCustomDomainPage;
  setData: (data: GetTeamDataByDomainOrCustomDomainPage) => void;
  useAssistantResponse: UseAssistantResponse | undefined;
}

export const TeamAssistantContext = createContext<TeamAssistantContextProps>({
  data: null,
  setData: () => {},
  useAssistantResponse: undefined,
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

  const { assistantUrl } = useParams();

  const assistantId = assistantUrl
    ? initialData?.assistants.find(
        (assistant) => assistant.url === assistantUrl,
      )?.id
    : undefined;

  const useAssistantResponse: UseAssistantResponse = useAssistant({
    assistantId: assistantId,
    userId: undefined,
  });

  const value: TeamAssistantContextProps = {
    data,
    setData,
    useAssistantResponse,
  };

  return (
    <TeamAssistantContext.Provider value={value}>
      {children}
    </TeamAssistantContext.Provider>
  );
};
