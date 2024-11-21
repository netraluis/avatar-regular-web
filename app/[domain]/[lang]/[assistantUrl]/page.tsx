"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { useAssistant } from "@/components/context/useAppContext/assistant";
import { useTeamAssistantContext } from "@/components/context/teamAssistantContext";
import { TextAreaForm } from "@/components/textAreaForm";
import { ChatList } from "@/components/chat-list";
import { cn } from "@/lib/utils";

export default function Playground() {
  const { assistantUrl } = useParams();
  const [message, setMessage] = React.useState("");
  const [threadId, setThreadId] = React.useState<string | undefined>();

  const { data } = useTeamAssistantContext();

  const assistantId = data?.assistants.find(
    (assistant) => assistant.url === assistantUrl,
  )?.id;

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const { submitMessage, internatlThreadId, messages, error, loading, status } =
    useAssistant({
      threadId: threadId,
      assistantId: assistantId as string,
      userId: undefined,
    });

  const {
    messagesRef,
    scrollRef,
    visibilityRef,

    // isAtBottom, scrollToBottom
  } = useScrollAnchor();

  React.useEffect(() => {
    setThreadId(internatlThreadId);
  }, [internatlThreadId]);

  React.useEffect(() => {
    // Si `messagesRef` está disponible y tiene el último mensaje
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // eslint-disable-next-line
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  // eslint-disable-next-line
  const onClickButton = (e: any) => {
    handleSendMessage();
  };

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] h-screen"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px] pt-[100px]")} ref={messagesRef}>
        <ChatList
          messages={messages}
          showAnalizeInfo={status === "thread.run.completed" && loading}
        />
        {error && (
          <div>Estem treballant en l’error… Disculpa les molèsties.</div>
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <TextAreaForm
        handleInputChange={handleTextareaChange}
        handleKeyDown={handleKeyDown}
        input={message}
        loading={loading}
        submitMessage={handleSendMessage}
        status={status}
      />
    </div>
  );
}
