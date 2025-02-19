"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import ChatInterface from "./chat-interface";
import enTranslations from "./en.json";
import caTranslations from "./ca.json";
import { EntryPoint, EntryPointLanguages } from "@prisma/client";
import { GetAssistantType } from "@/lib/data/assistant";
interface ChatWidgetProps {
  language: "en" | "ca";
  teamId: string;
  assistantId: string;
  data: GetAssistantType;
  team: {
    name: string;
    logoUrl: string | null;
    avatarUrl: string | null;
  };
}

const translations = {
  en: enTranslations,
  ca: caTranslations,
};

export default function ChatWidget({
  language,
  teamId,
  assistantId,
  data,
  team,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslations, setCurrentTranslations] = useState(
    translations[language],
  );

  useEffect(() => {
    setCurrentTranslations(translations[language]);
  }, [language]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const entryPoints =
    data?.entryPoints[0]?.entryPoint.map(
      (
        entryPoint: EntryPoint & { entryPointLanguages: EntryPointLanguages[] },
      ) => ({
        text: entryPoint.entryPointLanguages[0].text,
        question: entryPoint.entryPointLanguages[0].question,
      }),
    ) || [];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all duration-300 ease-in-out">
      {isOpen ? (
        <div
          className={`mb-[16px] transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <ChatInterface
            setIsLoading={setIsLoading}
            translations={currentTranslations}
            teamId={teamId}
            assistantId={assistantId}
            isLoading={isLoading}
            entryPoints={entryPoints}
            name={data?.name || "Chatbotfor Agent"}
            team={team}
          />
        </div>
      ) : (
        <div
          className={`flex flex-col gap-2 mb-[16px] max-w-[280px] transition-all duration-300 ease-in-out ${isOpen ? "opacity-0 scale-60" : "opacity-100 scale-100"}`}
        >
          {data?.assistantCard[0]?.introMessage?.map(
            (message: string, index: number) => (
              <div
                key={index}
                className="bg-white rounded-[20px] p-4 shadow-lg"
              >
                <p className="text-[15px]">{message}</p>
              </div>
            ),
          )}
        </div>
      )}
      <Button
        onClick={handleToggleChat}
        className="w-12 h-12 rounded-full p-0"
        aria-label={
          isOpen
            ? currentTranslations.closeChatLabel
            : currentTranslations.openChatLabel
        }
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
