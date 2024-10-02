"use client";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import React from "react";
const AVATAR_ACTIVE = process.env.AVATAR_ACTIVE;

export default function ChatComponent() {
  if (!AVATAR_ACTIVE) {
    return (
      <div className="flex">
        <>no tiene un avatar asociado</>
      </div>
    );
  }
  return <InteractiveAvatar />;
}
