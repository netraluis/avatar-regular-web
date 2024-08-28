import { GlobalContext } from "./context/globalContext";
import { useContext, useEffect, useRef } from "react";
import { useAssistant as useAssistant, Message } from "ai/react";
import SelectorRectangle from "./selectorRectangle";
import { ErrorMessage } from "./errorMessage";
import { Messages } from "./messages";
import { TextAreaForm } from "./textAreaForm";

export default function ConversationRecipient() {
  const { setActualThreadId } = useContext(GlobalContext);
  const scrollRef = useRef<any>(null);

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    append,
  } = useAssistant({ api: "/api/assistant-stream" });

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  const onClickButton = (e: any) => {
    submitMessage(e);
  };

  const handleClick = async (e: any, question: string) => {
    append({ content: question, role: "user" });
  };

  useEffect(() => {
    if (threadId) {
      setActualThreadId(threadId);
    }
  }, [threadId, setActualThreadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <>
      {
        <div
          className="block overflow-scroll  border-green-500  flex flex-col justify-end grow w-full max-w-[700px]h-full "
          style={{
            scrollbarWidth: "none" as "none", // Cast as 'none'
            msOverflowStyle: "none", // This is okay as a string
          }}
        >
          {/* Custom CSS for WebKit browsers */}
          <style>
            {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
          </style>
          <div
            className="overflow-scroll  border-red-500 mx-4"
            style={{
              scrollbarWidth: "none" as "none", // Cast as 'none'
              msOverflowStyle: "none", // This is okay as a string
            }}
            ref={scrollRef}
          >
            {/* Custom CSS for WebKit browsers */}
            <style>
              {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
            </style>
            {
              <>
                {messages && messages.length > 0 ? (
                  <Messages messages={messages} />
                ) : (
                  <SelectorRectangle handleClick={handleClick} />
                )}
                {error && <ErrorMessage />}
              </>
            }
          </div>
          <TextAreaForm
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            input={input}
            status={status}
            submitMessage={submitMessage}
          />
        </div>
      }
    </>
  );
}
