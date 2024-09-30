/* eslint-disable */
import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi,
} from "@heygen/streaming-avatar";

import { useAssistant as useAssistant } from "ai/react";
import OpenAI from "openai";
import { use, useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { GlobalContext } from "./context/globalContext";
import { createClient } from "@/lib/supabase/client";
import MarkdownDisplay from "./MarkDownDisplay";
import removeMarkdown from "remove-markdown";
import { FooterText } from "./footer";

interface InteractiveAvatarProps {
  speak: string; // Define speak as a string type
}

interface Message {
  role: string;
  message: string;
}

const useDatabaseSubscription = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [speak, setSpeak] = useState<Message>({ role: "", message: "" });
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("avatar-communication")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messages",
        },
        (payload: any) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
          if (payload.new.role === "assistant") {
            setSpeak(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { messages, speak };
};

export default function InteractiveAvatar() {
  const { domainData } = useContext(GlobalContext);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false); // Track initialization
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);

  const voiceId = domainData?.voiceAvatarId;
  const avatarId = domainData?.avatarId;

  const { speak, messages } = useDatabaseSubscription();

  const speakAsync = async () => {
    if (!speak) return;
    if (!initialized || !avatar.current) return;
    const patron = /【[^】]*】/g;
    const speakPlain = removeMarkdown(speak.message).replace(patron, "");
    // speakPlain = speakPlain;
    console.log("speakPlain:", speakPlain);
    try {
      await avatar.current.speak({
        taskRequest: { text: speakPlain, sessionId: data?.sessionId },
      });
    } catch (e: any) {
      setDebug(e.message);
    }
  };

  const supabase = createClient();

  const channelAvatar = supabase.channel("avatar");

  // Simple function to log any messages we receive
  async function messageReceived(payload: any) {
    console.log(
      "Message received:",
      payload.payload.messages,
      payload.payload.messages.length,
      payload.payload.messages[payload.payload.messages.length - 1],
    );
    if (!speak) return;
    if (!initialized || !avatar.current) return;
    await avatar.current.speak({
      taskRequest: {
        text: payload.payload.messages[payload.payload.messages.length - 1]
          .content,
        sessionId: data?.sessionId,
      },
    });

    console.log(payload);
  }

  // Subscribe to the Channel
  // channelAvatar
  //   .on(
  //     "broadcast",
  //     { event: "test" },
  //     async (payload) => await messageReceived(payload),
  //   )
  //   .subscribe();

  useEffect(() => {
    console.log("Speak:", speak);
    // Define an async function within the useEffect

    // Call the async function
    speakAsync();
  }, [speak, initialized, avatar, data?.sessionId]);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      console.log("Access Token:", token); // Log the token to verify
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    await updateToken();
    if (!avatar.current) {
      setDebug("Avatar API is not initialized");
      return;
    }
    try {
      console.log({ avatarId, voiceId });
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId },
          },
        },
        setDebug,
      );
      setData(res);
      setStream(avatar.current.mediaStream);
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `There was an error starting the session. ${voiceId ? "This custom voice ID may not be supported." : ""}`,
      );
    }
    setIsLoadingSession(false);
  }

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log("Updating Access Token:", newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken }),
    );

    const startTalkCallback = (e: any) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      console.log("Avatar stopped talking", e);
    };

    console.log("Adding event handlers:", avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }

  async function handleInterrupt() {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
  }

  async function endSession() {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current.stopAvatar(
      { stopSessionRequest: { sessionId: data?.sessionId } },
      setDebug,
    );
    setStream(undefined);
  }

  useEffect(() => {
    async function init() {
      const newToken = await fetchAccessToken();
      console.log("Initializing with Access Token:", newToken); // Log token for debugging
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: newToken, jitterBuffer: 200 }),
      );
      setInitialized(true); // Set initialized to true
    }
    init();

    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  return (
    <>
      <>
        <div className="h-screen flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-screen w-screen justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <track kind="captions" />
              </video>
              {/* <div className="flex flex-col gap-2 absolute bottom-3 right-3">
                <Button
                  onClick={handleInterrupt}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                >
                  Interrupt task
                </Button>
                <Button
                  onClick={endSession}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                >
                  End session
                </Button>
              </div> */}
            </div>
          ) : !isLoadingSession ? (
            <div className="h-full justify-center items-center flex flex-col gap-8 w-[500px] self-center">
              <Button
                onClick={startSession}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
              >
                Start session
              </Button>
            </div>
          ) : (
            <div>Cargando...</div>
          )}
          <div className="absolute bottom-0 z-10">
            <div className="relative">
              <div className="overflow-auto max-h-80 mb-3">
                {messages.length > 2 && (
                  <div className=" m-7">
                    <div
                      className={`${messages[messages.length - 2].role === "user" ? "justify-end" : "justify start"} flex`}
                    >
                      <div className="bg-slate-950/25 text-slate-50 rounded-2xl p-2 mb-2">
                        <MarkdownDisplay
                          markdownText={messages[messages.length - 2].message}
                        />
                      </div>
                    </div>
                    <div
                      className={`${messages[messages.length - 1].role === "user" ? "justify-end" : "justify start"} flex`}
                    >
                      <div className="bg-slate-950/25 text-slate-50 rounded-2xl p-2 mt-2">
                        <MarkdownDisplay
                          markdownText={messages[messages.length - 1].message}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-950/25 to-transparent pointer-events-none"></div> */}
            </div>
            <div className="w-fit bg-slate-950/25 mx-auto space-y-4 border-none px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
              <FooterText className="hidden sm:block text-slate-50 border-none" />
            </div>
          </div>
        </div>
      </>
    </>
  );
}
