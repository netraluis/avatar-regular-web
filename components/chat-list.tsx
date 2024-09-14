import { useContext } from "react";
import Avatar from "./avatar";
import MarkdownDisplay from "./MarkDownDisplay";
import { GlobalContext } from "./context/globalContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export interface ChatList {
  messages: any;
}

export function ChatList({ messages }: ChatList) {
  const { showAnalizeInfo } = useContext(GlobalContext);
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
            {/* {index < messages.length - 1 && <Separator className="my-4" />} */}
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
    </div>
  );
}
