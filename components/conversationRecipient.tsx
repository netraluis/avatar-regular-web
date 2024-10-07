import { useContext, useEffect } from "react";
import { Message, useAssistant as useAssistant } from "ai/react";
import { TextAreaForm } from "./textAreaForm";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
import { GlobalContext } from "./context/globalContext";
import React from "react";

export default function ConversationRecipient() {
  const { setActualThreadId, actualThreadId, setShowAnalizeInfo, domainData } =
    useContext(GlobalContext);

  const [messagesState, setMessagesState] = React.useState<Message[]>([]);

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    append,
  } = useAssistant({
    api: "/api/assistant-stream",
    body: {
      assistantId: domainData.assistantId,
      threadId: actualThreadId,
      domainId: domainData.id,
    },
  });

  if (error) {
    console.log({ error });
  }

  useEffect(() => {
    try {
      if (messages.length < 1) return;
      const lastMessage = messages[messages.length - 1];
      setMessagesState((prevMessages) => {
        // Encontrar si el mensaje ya existe en la lista
        const existingMessageIndex = prevMessages.findIndex(
          (msg) => msg.id === lastMessage.id,
        );

        if (existingMessageIndex !== -1) {
          // Sobrescribir el mensaje acumulado
          const updatedMessages = [...prevMessages];
          if (lastMessage.role === "user") {
            updatedMessages[existingMessageIndex] = lastMessage;
            return updatedMessages;
          }
          const accMessage =
            updatedMessages[existingMessageIndex].content + lastMessage.content;
          updatedMessages[existingMessageIndex] = {
            ...lastMessage,
            content: accMessage,
          };
          return updatedMessages;
        } else {
          // Si es un nuevo mensaje, añadirlo a la lista
          // if(lastMessage.role === "user") return prevMessages
          return [...prevMessages, lastMessage];
        }
      });
    } catch (e) {
      console.log({ e });
    }

    // Si el último mensaje existe y es del asistente, actualizar el contenido acumulado
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messagesState));
  }, [messages]);

  useEffect(() => {
    if (
      status === "awaiting_message" &&
      messagesState[messagesState.length - 1]?.role === "assistant"
    ) {
      localStorage.setItem(
        "speak",
        JSON.stringify(messagesState[messagesState.length - 1]),
      );
    }
  }, [messagesState, status]);

  const {
    messagesRef,
    scrollRef,
    visibilityRef,
    // isAtBottom, scrollToBottom
  } = useScrollAnchor();

  // eslint-disable-next-line
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  // eslint-disable-next-line
  const onClickButton = (e: any) => {
    submitMessage(e);
  };

  // eslint-disable-next-line
  const handleClick = async (e: any, question: string) => {
    append({ content: question, role: "user" });
  };

  useEffect(() => {
    if (threadId) {
      setActualThreadId(threadId);
    }
  }, [threadId, setActualThreadId]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastMessageRole = lastMessage?.role;
    const showLoading = lastMessageRole === "user" && status === "in_progress";
    setShowAnalizeInfo(showLoading);
  }, [status, messages]);

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] h-screen"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px]  pt-[100px]")} ref={messagesRef}>
        {messagesState.length ? <ChatList messages={messagesState} /> : <></>}
        {error && <div>Estem treballant en l’error… Disculpa les molèsties.</div>}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <TextAreaForm
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        input={input}
        status={status}
        submitMessage={submitMessage}
        // isAtBottom={isAtBottom}
        // scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
