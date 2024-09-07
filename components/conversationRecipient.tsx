import { useContext, useEffect } from "react";
import { useAssistant as useAssistant } from "ai/react";
import { TextAreaForm } from "./textAreaForm";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";

import { GlobalContext } from "./context/globalContext";

export default function ConversationRecipient() {
  const { setActualThreadId } = useContext(GlobalContext);

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    // error,
    threadId,
    append,
  } = useAssistant({
    api: "/api/assistant-stream",
    body: {
      assistantId: undefined,
    },
  });

  // console.log("error", error);
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

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] h-screen"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px]  pt-[100px]")} ref={messagesRef}>
        {messages.length ? <ChatList messages={messages} /> : <></>}
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
