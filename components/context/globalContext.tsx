"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

export type History = { who: string; message: string };

interface GlobalContextProps {
  state: number;
  setState: (state: number) => void;
  actualsThreadId: string[];
  setActualsThreadId: (
    thread: string[] | ((prev: string[]) => string[]),
  ) => void;
  actualThreadId: string;
  setActualThreadId: (thread: string) => void;
}

export const GlobalContext = createContext<GlobalContextProps>({
  state: 1,
  setState: () => {},
  actualsThreadId: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActualsThreadId: (thread: string[] | ((prev: string[]) => string[])) => {},
  actualThreadId: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setActualThreadId: (thread: string) => {},
});

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useEstadoGlobal must be used within a EstadoGlobalProvider",
    );
  }
  return context;
};

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<number>(1);
  const [actualsThreadId, setActualsThreadId] = useState<string[]>([""]);
  const [actualThreadId, setActualThreadId] = useState<string>("");

  const value = {
    state,
    setState,
    actualsThreadId,
    setActualsThreadId,
    actualThreadId,
    setActualThreadId,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
