"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  MoreVertical,
  Maximize2,
  Minimize2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { keyframes } from "@emotion/react";
import { useAssistant } from "@/components/context/useAppContext/assistant";
import { UseAssistantResponse } from "@/components/context/useAppContext/assistant";
import Image from "next/image";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const animatedMessageStyle = {
  animation: `${fadeIn} 0.3s ease-out forwards`,
};

interface ChatInterfaceProps {
  setIsLoading: (isLoading: boolean) => void;
  translations: Record<string, string>;
  teamId: string;
  assistantId: string;
  isLoading: boolean;
  entryPoints: {
    text: string;
    question: string;
  }[];
  name: string;
  team: {
    name: string;
    logoUrl: string | null;
    avatarUrl: string | null;
  };
}


export default function ChatInterface({
  setIsLoading,
  // translations,
  teamId,
  assistantId,
  isLoading,
  entryPoints,
  team
}: ChatInterfaceProps) {
  // const [messages, setMessages] = useState<Message[]>([
  //   {
  //     id: 1,
  //     text: "Resolve issues instantly and deliver exceptional customer experiences with Fin AI Agent.",
  //     sender: "ai",
  //   },
  // ])
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showAnalizeInfo, setShowAnalizeInfo] = useState(true);

  const useAssistantResponse: UseAssistantResponse = useAssistant({
    assistantId: assistantId,
    userId: undefined,
    teamId: teamId,
  });

  const {
    submitMessage,
    messages,
    // error,
    loading,
    status,
    internatlThreadId,
    setInternalThreadId,
    setMessages,
  } = useAssistantResponse;
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    setShowAnalizeInfo(status !== "thread.message.delta" &&
      status !== "thread.message.completed" &&
      status !== "thread.run.step.completed" &&
      status !== "thread.run.completed" &&
      status !== "timeout"
    );
  }, [status]);

  useEffect(() => {
      setShowActions(false);
  }, [internatlThreadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, messagesEndRef, isExpanded]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      submitMessage(input);
      setInput("");
    }
  };

  const handleNewChat = () => {
    setInternalThreadId(undefined);
    setMessages([]);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action: string) => {
    setInput(action);
    setShowActions(false);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const TypingIndicator = () => (
    <div className="px-4">
      <div className="bg-[#F8F9FC] p-4 rounded-3xl inline-flex items-center space-x-2">
        {!team.avatarUrl ? <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">

        </div>:<div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden border">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${team.avatarUrl}`}
              alt='avatar'
              width={60}
              height={60}
              unoptimized
            />
          </div>}
          <span className="font-semibold text-[14px]">
            Analitzant totes les fonts d’informació
          </span>
          <div className="flex space-x-1">
            <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse delay-150" />
            <span className="w-1 h-1 rounded-full bg-gray-400 animate-pulse delay-300" />
            </div>
 
      </div>
    </div>
  );


  const messageAnimationClass = "animate-fade-in";


  return (
    <Card
      className={`w-[400px] flex flex-col rounded-[16px] bg-white overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${isExpanded ? "h-[700px]" : "h-[640px]"
        }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-4">
        <div className="flex items-center gap-3">
          {!team.logoUrl ? <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-500 flex items-center justify-center text-white text-sm font-bold">
            
          </div>:
          <div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden border">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${team.logoUrl}`}
              alt='logo'
              width={60}
              height={60}
              unoptimized
            />
          </div>}
          <span className="font-semibold text-[17px]">{team.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleNewChat}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>New Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 mb-6">
            <div className="px-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${messageAnimationClass}`}
                    style={animatedMessageStyle}
                  >
                    <div
                      className={`p-4 rounded-[32px] max-w-[85%] ${message.role === "user"
                          ? "bg-[#0F172A] text-white"
                          : "bg-[#F8F9FC]"
                        }`}
                    >
                      {message.role === "assistant" && index === 0 && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold">
                            CA
                          </div>
                          <span className="font-semibold text-[14px]">
                            Chatbotfor Agent
                          </span>
                        </div>
                      )}
                      <p className="text-[16px] leading-normal">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {showAnalizeInfo && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4">
        <div className="w-full">
          {showActions && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {entryPoints.map(({ text, question }, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleActionClick(question)}
                >
                  <span className="text-sm">{text}</span>
                </Button>
              ))}
            </div>
          )}
          <div className="relative flex items-end mb-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                adjustTextareaHeight();
              }}
              onInput={adjustTextareaHeight}
              placeholder="Escriu una pregunta..."
              className="w-full pr-12 py-3 min-h-[50px] max-h-[120px] text-[15px] text-slate-600 bg-white border border-gray-100 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-y-auto duration-200 placeholder:text-slate-500"
              style={{
                paddingRight: "4rem",
                height: "48px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="absolute right-1 bottom-1 h-[40px] w-[40px] bg-[#0B0F1D] hover:bg-[#0B0F1D]/90 rounded-xl"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            Powered by{" "}
            <Link href="https://chatbotfor.ai" className="hover:text-gray-700">
              chatbotfor.ai
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
