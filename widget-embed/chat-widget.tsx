"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { MessageCircle, X } from "lucide-react"
import ChatInterface from "./chat-interface"
import enTranslations from "./en.json"
import caTranslations from "./ca.json"
import "./output.css"

interface ChatWidgetProps {
  language: "en" | "ca"
  teamId: string
  assistantId: string
}

const translations = {
  en: enTranslations,
  ca: caTranslations,
}

export default function ChatWidget({ language, teamId, assistantId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTranslations, setCurrentTranslations] = useState(translations[language])

  useEffect(() => {
    setCurrentTranslations(translations[language])
  }, [language])

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <ChatInterface
          setIsLoading={setIsLoading}
          translations={currentTranslations}
          teamId={teamId}
          assistantId={assistantId}
          isLoading={isLoading}
        />
      )}
      <div className="mt-2">
        <Button
          onClick={handleToggleChat}
          className="w-12 h-12 rounded-full p-0"
          aria-label={isOpen ? currentTranslations.closeChatLabel : currentTranslations.openChatLabel}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  )
}

