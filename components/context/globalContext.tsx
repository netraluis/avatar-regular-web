"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

export type History = { who: string; message: string };

interface MenuHeader {
  name: string;
  description: string;
  href: string;
}

interface MenuBody {
  description: string;
  href: string;
}

export type Domain = {
  id: string;
  name: string;
  subDomain: string;
  customDomain: string;
  welcome: string;
  logo: string;
  assistantId: string;
  assistantName: string;
  menuHeader: MenuHeader[];
  menuBody: MenuBody[];
  menufooter: string;
  createdAt: Date;
};

interface GlobalContextProps {
  state: number;
  setState: (state: number) => void;
  actualsThreadId: string[];
  setActualsThreadId: (
    thread: string[] | ((prev: string[]) => string[]),
  ) => void;
  actualThreadId: string;
  setActualThreadId: (thread: string) => void;
  user: any;
  setUser: (user: any) => void;
  showAnalizeInfo: boolean;
  setShowAnalizeInfo: (show: boolean) => void;
  domainData: Domain;
  setDomainData: (data: any) => void;
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
  user: null,
  setUser: () => {},
  showAnalizeInfo: false,
  setShowAnalizeInfo: () => {},
  domainData: {
    id: "",
    name: "",
    subDomain: "",
    customDomain: "",
    welcome: "",
    logo: "",
    assistantId: "",
    assistantName: "",
    menuHeader: [],
    menuBody: [],
    menufooter: "",
    createdAt: new Date(),
  },
  setDomainData: () => {},
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
  const [user, setUser] = useState<any>(null);
  const [showAnalizeInfo, setShowAnalizeInfo] = useState(false);
  const [domainData, setDomainData] = useState<any>(null);

  const value = {
    state,
    setState,
    actualsThreadId,
    setActualsThreadId,
    actualThreadId,
    setActualThreadId,
    user,
    setUser,
    showAnalizeInfo,
    setShowAnalizeInfo,
    domainData,
    setDomainData,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
