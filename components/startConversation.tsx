"use client";
import { useContext } from "react";
import ConversationRecipient from "./conversationRecipient";
import { GlobalContext } from "./context/globalContext";

export default function StartConversation() {
  const { actualsThreadId } = useContext(GlobalContext);

  return (
    <>
      {actualsThreadId.map((threads, index) => {
        if (index === actualsThreadId.length - 1) {
          return <ConversationRecipient key={index} />;
        } else {
          return <></>;
        }
      })}
    </>
  );
}