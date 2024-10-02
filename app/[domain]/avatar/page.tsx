"use client";
import { GlobalContext } from "@/components/context/globalContext";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import React, { useContext } from "react";


export default function ChatComponent() {
  const { domainData } = useContext(GlobalContext);
  if (domainData?.assistantId){
    return <div className="flex"><>no tiene un avatar asociado</></div>
  }
  return <InteractiveAvatar />;
}
