"use client";
import { useContext } from "react";
import Welcome from "./component/welcome";
import { GlobalContext } from "./component/context/globalContext";
import StartConversation from "./component/startConversation";

export default function Page() {
  const { state } = useContext(GlobalContext);


  switch (state) {
    case 2:
      return <StartConversation />;
      break;
    default:
      return <Welcome />;
      break;
  }
}
