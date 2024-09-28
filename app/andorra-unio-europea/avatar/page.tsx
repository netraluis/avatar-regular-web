/* eslint-disable */
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import InteractiveAvatar from "@/components/InteractiveAvatar";

interface Message {
  role: string;
  message: string;
}

export default function ChatComponent() {
  return (
    <>
      {false ? (
        <>work in progress</>
      ) : (
        <div>
          <InteractiveAvatar />
        </div>
      )}
    </>
  );
}
