"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";

export type History = { who: string; message: string };

export interface MenuHeader {
  name: string;
  description: string;
  href: string;
}

export interface MenuBody {
  description: string;
  href: string;
}

export interface HeaderDisclaimer {
  buttonText: string;
  title: string;
  text: string;
}

export interface Question {
  label: string;
  value: string;
}

export interface welcomeCard {
  title: string;
  description: string;
  emoji: string;
  voiceId: string;
  avatarId: string;
  assistantId: string;
  questions?: Question[];
}

export interface WelcomeDesign {
  data: string[];
  type: string;
}

export type Domain = {
  id: string;
  name: string;
  subDomain: string;
  customDomain: string;
  welcome: string;
  welcomeDesign?: WelcomeDesign;
  logo: string;
  description: string | null;
  assistantId: string;
  assistantName: string;
  menuHeader: MenuHeader[];
  menuBody: MenuBody[];
  menufooter: string;
  avatarId: string;
  voiceAvatarId: string;
  headerDisclaimer: HeaderDisclaimer | null;
  symbol: string | null;
  createdAt: Date;
  welcomeCards: welcomeCard[];
  footerText?: string | null;
};

interface GlobalContextProps {
  state: {
    position: number;
    voiceId?: string;
    avatarId?: string;
    assistantId?: string;
  };
  setState: (input: {
    position: number;
    voiceId?: string;
    avatarId?: string;
    assistantId?: string;
  }) => void;
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
  welcomeCard: welcomeCard | undefined;
  setWelcomeCard: (card: welcomeCard) => void;
}

export const GlobalContext = createContext<GlobalContextProps>({
  state: { position: 1 },
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
    description: null,
    assistantId: "",
    assistantName: "",
    menuHeader: [],
    menuBody: [],
    menufooter: "",
    avatarId: "",
    voiceAvatarId: "",
    headerDisclaimer: null,
    createdAt: new Date(),
    symbol: null,
    welcomeCards: [],
    welcomeDesign: undefined,
  },
  setDomainData: () => {},
  welcomeCard: undefined,
  setWelcomeCard: () => {},
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
  const [state, setState] = useState<{
    position: number;
    voiceId?: string;
    avatarId?: string;
    assistantId?: string;
  }>({ position: 1 });
  const [actualsThreadId, setActualsThreadId] = useState<string[]>([""]);
  const [actualThreadId, setActualThreadId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [showAnalizeInfo, setShowAnalizeInfo] = useState(false);
  const [domainData, setDomainData] = useState<any>();
  const [welcomeCard, setWelcomeCard] = useState<welcomeCard | undefined>(
    undefined,
  );

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
    welcomeCard,
    setWelcomeCard,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
