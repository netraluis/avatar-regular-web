import Avatar from "./avatar";
import MarkdownDisplay from "./MarkDownDisplay";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export interface ChatList {
  messages: any;
  showAnalizeInfo: boolean;
  avatarUrl?: string;
  assistantName: string;
}

export function ChatList({
  messages,
  showAnalizeInfo,
  avatarUrl,
  assistantName,
}: ChatList) {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.length > 0 &&
        messages.map((message: any) => {
          return (
            <div className="my-4" key={message.id}>
              <Avatar
                imageUrl={
                  message.role === "assistant"
                    ? avatarUrl
                      ? avatarUrl
                      : "/avatar.png"
                    : "/start.png"
                }
                roleName={message.role === "assistant" ? assistantName : "Tu"}
              />
              {<MarkdownDisplay markdownText={message.message} />}
            </div>
          );
        })}
      {showAnalizeInfo && (
        <div className="my-4">
          <Avatar imageUrl={avatarUrl ? avatarUrl : "/avatar.png"} />
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
