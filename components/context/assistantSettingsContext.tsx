"use client";
import { GetAssistantType } from "@/lib/data/assistant";
import { Prisma } from "@prisma/client";
import React, { ReactNode, createContext, useContext, useState } from "react";

interface AssistantSettingsContextProps {
  data: Prisma.AssistantUpdateInput;
  setData: (data: Prisma.AssistantUpdateInput) => void;
  assistantValues?: GetAssistantType;
  setAssistantValues: (assistant: GetAssistantType) => void;
}

export const AssistantSettingsContext =
  createContext<AssistantSettingsContextProps>({
    data: {},
    setData: () => {},
    setAssistantValues: () => {},
  });

export const useAssistantSettingsContext = () => {
  const context = useContext(AssistantSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useEstadoAssistantSettings must be used within a EstadoAssistantSettingsProvider",
    );
  }
  return context;
};

export const AssistantSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<Prisma.AssistantUpdateInput>({});
  const [assistantValues, setAssistantValues] =
    React.useState<GetAssistantType>(null);

  const value = {
    data,
    setData,
    assistantValues,
    setAssistantValues,
  };

  return (
    <AssistantSettingsContext.Provider value={value}>
      {children}
    </AssistantSettingsContext.Provider>
  );
};
