"use client";

import * as React from "react";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { useTeamAssistantContext } from "@/components/context/teamAssistantContext";
import { TextAreaForm } from "@/components/textAreaForm";
import { ChatList } from "@/components/chat-list";
import { cn } from "@/lib/utils";

export default function AssistantUrl() {
  const [message, setMessage] = React.useState("");

  const { useAssistantResponse } = useTeamAssistantContext();

  if (!useAssistantResponse) return <>No se ha encontrado asistente</>;

  const { submitMessage, messages, error, loading, status } =
    useAssistantResponse;

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const {
    messagesRef,
    scrollRef,
    visibilityRef,

    // isAtBottom, scrollToBottom
  } = useScrollAnchor();

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
