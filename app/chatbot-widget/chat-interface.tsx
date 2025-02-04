"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, PlusCircle } from "lucide-react";
import {
  useAssistant,
  UseAssistantResponse,
} from "../../components/context/useAppContext/assistant";
import MarkdownDisplay from "../../components/MarkDownDisplay";

interface ChatInterfaceProps {
  translations: Record<string, string>;
  teamId: string;
  assistantId: string;
  visible: boolean;
}

export default function ChatInterface({
  translations,
  teamId,
  assistantId,
  visible,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // TODO aqui
  // const getTeam = async () => {
  //   const response = await fetch(`/api/protected/team/${teamId}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json", 
  //       // Aquí enviamos el userId en los headers
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Error: ${response.statusText}`);
  //   }
  //   const responseData = await response.json();
  // }

  const useAssistantResponse: UseAssistantResponse = useAssistant({
    assistantId: assistantId,
    userId: undefined,
    teamId: teamId,
    paddleSubscriptionId: undefined
  });

  const {
    submitMessage,
    messages,
    error,
    loading,
    // status,
    // internatlThreadId,
    setInternalThreadId,
    setMessages,
  } = useAssistantResponse;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  if (!visible) return;

  const handleNewChat = () => {
    setInternalThreadId(undefined);
    setMessages([]);
  };

  return (
    <Card className="w-80 h-96 flex flex-col mb-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b">
        <CardTitle className="text-lg font-semibold">
          {translations.chatTitle}
        </CardTitle>
        {messages.length > 0 && (
          <Button
            onClick={handleNewChat}
            className="px-3 py-1 text-sm bg-black text-white hover:bg-gray-800 transition-colors duration-200"
            aria-label={translations.newChatLabel}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {translations.newChatLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                    }`}
                >
                  <MarkdownDisplay markdownText={message.message} />
                </div>
              </div>
            ))}
            {error?.type === "UNKNOWN" && (
              <div className="relative mx-auto max-w-2xl px-4 text-red-500">
                {translations.error}
              </div>
            )}
            {error?.type === "timeout" && (
              <div className="relative mx-auto max-w-2xl px-4 text-red-500">
                {translations.timeout}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex w-full space-x-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={translations.inputPlaceholder}
            className="flex-grow"
          />
          <Button
            type="submit"
            className="px-3 h-10"
            disabled={loading}
            aria-label={translations.sendButtonLabel}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
