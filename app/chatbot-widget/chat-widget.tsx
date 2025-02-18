"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import ChatInterface from "./chat-interface";
import enTranslations from "./en.json";
import caTranslations from "./ca.json";

interface ChatWidgetProps {
  language: "en" | "ca";
  teamId: string;
  assistantId: string;
}

const translations = {
  en: enTranslations,
  ca: caTranslations,
};

export default function ChatWidget({
  language,
  teamId,
  assistantId,
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
          />
        </div>
      ) : (
        <div
          className={`flex flex-col gap-2 mb-[16px] max-w-[280px] transition-all duration-300 ease-in-out ${isOpen ? "opacity-0 scale-60" : "opacity-100 scale-100"}`}
        >
          <div className="bg-white rounded-[20px] p-4 shadow-lg">
            <p className="text-[15px]">
              Looking for answers? Im here to help!
            </p>
          </div>
          <div className="bg-white rounded-[20px] p-4 shadow-lg">
            <p className="text-[15px]">
              You can add an agent like me to your website in minutes! 🚀
            </p>
          </div>
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
