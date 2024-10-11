import { useContext, useEffect, useState } from "react";
import Avatar from "./avatar";
import MarkdownDisplay from "./MarkDownDisplay";
import { GlobalContext } from "./context/globalContext";
import { ArrowPathIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export interface ChatList {
  messages: any;
}

export function ChatList({ messages }: ChatList) {
  const { showAnalizeInfo } = useContext(GlobalContext);
  const [interrump, setInterrump] = useState(false);
  const [interrumping, setInterrumping] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "avatarTalking") {
        const newValue = JSON.parse(event.newValue);
        // Actualiza tu estado o contexto con el nuevo valor
        setInterrumping(false)
        setInterrump(newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message: any) => {
        return (
          <div className="my-4" key={message.id}>
            <Avatar name={message.role} />
            <MarkdownDisplay markdownText={message.content} />
          </div>
        );
      })}

      {showAnalizeInfo && (
        <div className="my-4">
          <Avatar name="assistant" />
          <div className="mt-4 text-slate-400 flex font-light text-sm">
            <ArrowPathIcon
              className="ml-0.5 h-5 w-5 animate-spin mr-1"
              aria-hidden="true"
            />
            <span>Analitzant totes les fonts d’informació</span>
          </div>
        </div>
      )}
      {interrump && (
        <div className="my-4 text-slate-400 flex items-center font-light text-sm">
          {/* Icono de sonido con animación */}
          <SpeakerWaveIcon
            className="ml-0.5 h-5 w-5 animate-pulse mr-1"
            aria-hidden="true"
          />
          <span className="mr-4">Meritxell parlant...</span>

          {/* Botón "Interrompre" */}
          <Button
            onClick={() => {
              setInterrumping(true);
              localStorage.setItem(
                "interrump",
                JSON.stringify(messages[messages.length - 1])
              );
            }}
            disabled={interrumping}
            className="text-sm text-black bg-white border rounded-md px-4 py-1 hover:bg-gray-100"
          >
            {!interrumping ? (
              "Interrompre"
            ) : (
              <ArrowPathIcon
                className="ml-0.5 h-5 w-5 animate-spin mr-1"
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
