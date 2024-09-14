/* eslint-disable */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import InteractiveAvatar from "@/components/InteractiveAvatar";

interface Message {
  role: string;
  message: string;
}

const useDatabaseSubscription = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [speak, setSpeak] = useState<Message>({ role: "", message: "" });
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("avatar-communication")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
        },
        (payload: any) => {
          console.log(payload);
          setMessages((prevMessages) => [...prevMessages, payload.new]);
          if (payload.new.role === "assistant") {
            setSpeak(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { messages, speak };
};

export default function ChatComponent() {
  const { messages, speak } = useDatabaseSubscription();

  return (
    <>
      {true ? (
        <>work in progress</>
      ) : (
        <div>
          {messages.map((msg: any, index) => (
            <div key={index} className="relative z-40 bg-slate-50">
              <strong>{msg.role}:</strong> {msg.message}
            </div>
          ))}
          <InteractiveAvatar speak={speak.message} />
        </div>
      )}
    </>
  );
}
