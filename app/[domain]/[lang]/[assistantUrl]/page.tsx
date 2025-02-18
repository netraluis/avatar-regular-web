"use client";

import * as React from "react";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { useTeamAssistantContext } from "@/components/context/teamAssistantContext";
import { TextAreaForm } from "@/components/text-area-forms/textAreaForm";
import { ChatList } from "@/components/chat-list";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useClientLanguage } from "@/components/context/clientLanguageContext";

export default function AssistantUrl() {
  const { t } = useClientLanguage();
  const textAreaForm = t("app.COMPONENTS.TEXT_AREA_FORM");
  const chatList = t("app.COMPONENTS.CHAT_LIST");
  const page = t("app.DOMAIN.LANG.ASSISTANT_URL.PAGE");

  const { assistantUrl } = useParams();
  const [message, setMessage] = React.useState("");
  const [card, setCard] = React.useState<any>(null);

  const { useAssistantResponse, data } = useTeamAssistantContext();

  React.useEffect(() => {
    if (data?.assistants) {
      const card = data.assistants.find((card) => {
        console.log(card.url, assistantUrl);
        return card.url === assistantUrl;
      })?.assistantCard[0];

      setCard(card);
    }
  }, [data]);

  if (!useAssistantResponse) return <>No assistant found </>;

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
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] h-screen scrollbar-hidden"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px] pt-[100px]")} ref={messagesRef}>
        <ChatList
          messages={messages}
          showAnalizeInfo={
            status !== "thread.message.delta" &&
            status !== "thread.message.completed" &&
            status !== "thread.run.step.completed" &&
            status !== "thread.run.completed" &&
            status !== "timeout"
          }
          avatarUrl={
            data?.avatarUrl
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.avatarUrl}`
              : undefined
          }
          assistantName={card?.title || ""}
          text={chatList}
        />

        {error?.type === "UNKNOWN" && (
          <div className="relative mx-auto max-w-2xl px-4 text-red-500">
            {page.error}
          </div>
        )}
        {error?.type === "timeout" && (
          <div className="relative mx-auto max-w-2xl px-4 text-red-500">
            {page.timeout}
          </div>
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
        text={textAreaForm}
      />
    </div>
  );
}
