import React, { createContext, useContext, ReactNode } from "react";
import { useAssistant } from "./useAppContext/assistant";

type AssistantContextType = ReturnType<typeof useAssistant>;

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined,
);

export const AssistantProvider = ({
  children,
  assistantId,
  userId,
  teamId,
  paddleSubscriptionId
}: {
  children: ReactNode;
  assistantId?: string;
  teamId: string;
  userId?: string;
  paddleSubscriptionId?: string;
}) => {
  if (!assistantId) return {};

  const assistant = useAssistant({
    assistantId,
    userId,
    teamId,
    paddleSubscriptionId
  });

  return (
    <AssistantContext.Provider value={assistant}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistantContext = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error(
      "useAssistantContext debe usarse dentro de AssistantProvider",
    );
  }
  return context;
};
