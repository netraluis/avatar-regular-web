"use client";
import { useContext } from "react";
import StartConversation from "./startConversation";
import Welcome from "./welcome";
import { GlobalContext } from "./context/globalContext";

const ConversationSwitcher = () => {
const { state } = useContext(GlobalContext);

  switch (state) {
    case 2:
      return <StartConversation />;
      break;
    default:
      return <Welcome />;
      break;
  }
};

export default ConversationSwitcher;
