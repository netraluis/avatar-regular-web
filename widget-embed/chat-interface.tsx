"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { ScrollArea } from "./scroll-area"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
}

interface ChatInterfaceProps {
  setIsLoading: (isLoading: boolean) => void
  translations: Record<string, string>
  teamId: string
  assistantId: string
  isLoading: boolean
}

export default function ChatInterface({
  setIsLoading,
  translations,
  teamId,
  assistantId,
  isLoading,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: input.trim(),
        sender: "user",
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      setInput("")

      // Simulate AI response
      setIsLoading(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now(),
          text: `This is a simulated AI response for team ${teamId} and assistant ${assistantId}.`,
          sender: "ai",
        }
        setMessages((prevMessages) => [...prevMessages, aiResponse])
        setIsLoading(false)
      }, 2000)
    }
  }

  return (
    <Card className="w-80 h-96 flex flex-col mb-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle>{translations.chatTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={translations.inputPlaceholder}
            className="flex-grow"
          />
          <Button type="submit" className="px-3 h-10" disabled={isLoading} aria-label={translations.sendButtonLabel}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

