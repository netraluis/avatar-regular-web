"use client";
import { useContext, useEffect } from "react";
import StartConversation from "./startConversation";
import Welcome from "./welcome";
import { GlobalContext } from "./context/globalContext";

const ConversationSwitcher = () => {
  const { state } = useContext(GlobalContext);

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("messages", JSON.stringify([]));
  }, [state]);

  switch (state.position) {
    case 2:
      return <StartConversation />;
      break;
    default:
      return <Welcome />;
      break;
  }
};

export default ConversationSwitcher;
