"use client";
import { useContext } from "react";
import { GlobalContext } from "./context/globalContext";
import ConversationRecipient from "./conversationRecipient";

export default function StartConversation() {
  const { actualsThreadId } = useContext(GlobalContext);

  return (
    <div className="mx-auto w-full max-w-6xl h-full pb-5 flex flex-col justify-end items-center">
      {actualsThreadId.map((threads, index) => {
        if (index === actualsThreadId.length - 1) {
          return <ConversationRecipient key={index} />;
        } else {
          return <></>;
        }
      })}
    </div>
  );
}
