/* eslint-disable */
import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi,
} from "@heygen/streaming-avatar";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { GlobalContext } from "./context/globalContext";
import MarkdownDisplay from "./MarkDownDisplay";
import removeMarkdown from "remove-markdown";
import { FooterText } from "./footer";
import React from "react";
import VideoPlayer from "./video-player";
import { Message } from "ai/react";
import Lottie from "lottie-react";
import animationData from "../public/charging-animation.json";

export default function InteractiveAvatar() {
  const { domainData } = useContext(GlobalContext);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false); // Track initialization
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [speak, setSpeak] = useState<any>([]);
  const [voiceId, setVoiceId] = useState<string>();
  const [avatarId, setAvatarId] = useState<string>();

  // const voiceId = domainData?.voiceAvatarId;
  // const avatarId = domainData?.avatarId;

  const startSessionRef = useRef<HTMLButtonElement>(null);
  const endSessionRef = useRef<HTMLButtonElement>(null);
  const interrumptRef = useRef<HTMLButtonElement>(null);

  const speakAsync = async () => {
    console.log({ speak });
    if (!speak) return;
    if (!initialized || !avatar.current) return;
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
    const patron = /【[^】]*】/g;
    const speakPlain = removeMarkdown(speak.content).replace(patron, "");
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

  // comunicate with the assistant
  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "messages") {
        const newValue = JSON.parse(event.newValue);
        if (newValue.length === 0) {
          if (interrumptRef.current) {
            console.log("Messages:", newValue.length);
            interrumptRef.current.click();
          }
        }
        // Actualiza tu estado o contexto con el nuevo valor
        setMessages(newValue);
      }
      if (event.key === "state") {
        console.log("State:", event.key, event.newValue);
        const state = JSON.parse(event.newValue);
        if (state.position === 2) {
          setVoiceId(state.voiceId || domainData?.voiceAvatarId);

          setAvatarId(state.avatarId || domainData?.avatarId);
        }
        if (state.position === 1) {
          setVoiceId("");
          if (endSessionRef.current) {
            endSessionRef.current.click();
          }
        }
      }

      if (event.key === "speak") {
        const newValue = JSON.parse(event.newValue);
        setSpeak(newValue);
      }

      if (event.key === "interrump") {
        if (interrumptRef.current) {
          console.log("interrump!!");
          interrumptRef.current.click();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [domainData]);

  //start session
  useEffect(() => {
    if (!voiceId || !avatarId) return;
    if (startSessionRef.current) {
      startSessionRef.current.click();
      console.log("------- a cargar -------");
      localStorage.setItem("avatar-charging", JSON.stringify(true));
    }
  }, [voiceId, avatarId]);

  //speak
  useEffect(() => {
    console.log("Speak:", speak);
    // Define an async function within the useEffect

    // Call the async function
    speakAsync();
  }, [speak]);

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
      setIsLoadingSession(false);
      console.log("-------ya esta cargaddo -------");
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `There was an error starting the session. ${voiceId ? "This custom voice ID may not be supported." : ""}`,
      );
    }
  }

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log("Updating Access Token:", newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken }),
    );

    const startTalkCallback = (e: any) => {
      localStorage.setItem("avatarTalking", JSON.stringify(true));
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      localStorage.setItem("avatarTalking", JSON.stringify(false));
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
        console.log("-------ya esta cargaddo damos al play -------");
        localStorage.setItem("avatar-charging", JSON.stringify(false));
      };
    }
  }, [mediaStream, stream]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollSpeed = 5; // Número de píxeles por cada movimiento
  const intervalTime = 2000; // Tiempo entre movimientos en milisegundos

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;

    if (messagesEndRef.current) {
      // Calcular la diferencia entre la posición actual y la posición final del scroll
      const container = messagesEndRef.current.parentNode as HTMLElement;
      const maxScrollTop = container.scrollHeight - container.clientHeight;

      scrollInterval = setInterval(() => {
        if (container.scrollTop < maxScrollTop) {
          container.scrollTop += scrollSpeed; // Mueve el scroll de a pocos píxeles
        } else {
          clearInterval(scrollInterval); // Detiene el intervalo cuando llega al final
        }
      }, intervalTime);
    }

    // Limpieza del intervalo cuando el componente se desmonte o cambie el efecto
    return () => clearInterval(scrollInterval);
  }, [speak]);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollAmount = 50; // Cantidad de píxeles que se desplazará cada vez
    const intervalTime = 1000; // Intervalo en milisegundos (1000ms = 1 segundo)

    // Crea el intervalo para mover el scroll
    const intervalId = setInterval(() => {
      if (messagesContainerRef.current) {
        // Desplaza hacia abajo el contenedor la cantidad de píxeles indicada
        messagesContainerRef.current.scrollBy({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    }, intervalTime);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {stream || isLoadingSession ? (
        <>
          <div className="h-screen w-screen justify-center items-center flex flex-col rounded-lg overflow-hidden z-30 relative">
            <video
              className="h-2/3"
              ref={mediaStream}
              autoPlay
              playsInline
              style={{
                // width: "100%",
                // height: "100%",
                objectFit: "cover",
              }}
            >
              <track kind="captions" />
            </video>
            <div className="h-1/3 bg-white text-black rounded-none w-screen text-base overflow-y-auto scrollbar-hide">
              {/* <div className="overflow-auto rounded-none "> */}
              {/* Contenedor para los mensajes */}
              <div className="flex-grow overflow-y-auto p-2 mt-2 rounded-none flex flex-col justify-center items-start text-xl mx-12">
                {messages.length >= 1 ? (
                  <MarkdownDisplay
                    markdownText={messages[messages.length - 1].content}
                  />
                ) : (
                  <div className="flex justify-center items-center w-full">
                    <Lottie
                      // className="justify-center"
                      animationData={animationData}
                      loop={true}
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                )}
              </div>
              {/* </div> */}
              {/* <div className="w-fit bg-slate-950/25 mx-auto space-y-4 border-none px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4"> */}
              {/* <FooterText className="hidden sm:block text-slate-50 border-none" /> */}
              {/* </div> */}
              {/* Footer fijo en la parte inferior */}
              {/* Referencia para el scroll al final de los mensajes */}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto bg-white w-screen z-30">
              {/* <FooterText className="sm:block  border-none" /> */}
              <p className="px-2 text-center leading-normal text-muted-foreground text-lg bg-slate-100 pt-1">
                {/* Totes les respostes dd&aposaquesta conversa estan generades mitjançant una
                Intel·ligència Artificial (AI) */}
                {domainData?.footerText ||
                  "Totes les respostes d'aquesta conversa estan generades mitjançant una Intel·ligència Artificial (AI)"}
              </p>
            </div>
          </div>

          <div className="absolute h-2/3 top-0 w-screen justify-center items-center flex rounded-lg overflow-hidden z-20 ">
            <video
              className="w-full h-full"
              src="/avatar-loading.mp4"
              loop
              muted
              autoPlay
              style={{ objectFit: "cover" }}
            ></video>
          </div>

          <div className="flex flex-col gap-2 absolute bottom-3 right-3">
            <Button
              ref={interrumptRef}
              onClick={handleInterrupt}
              className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
            >
              Interrupt task
            </Button>
            <Button
              ref={endSessionRef}
              onClick={endSession}
              className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
            >
              End session
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full relative">
          <VideoPlayer
            src="/avatar-waiting.mp4"
            fullScreen={true}
            controls={false}
            autoPlay={true}
            loop={true}
          />

          <div className="absolute inset-0 flex justify-center items-end z-10">
            <Button
              ref={startSessionRef}
              onClick={startSession}
              className="bg-transparent text-transparent"
            >
              Start session
            </Button>
          </div>
        </div>
      )}
      {/* <div className="absolute bottom-0 z-40">
        <div className="relative">
          <div className="overflow-auto max-h-80 mb-3">
            <div className=" m-7">
              {messages.length >= 2 && (
                <div
                  className={`${messages[messages.length - 2].role === "user" ? "justify-end" : "justify start"} flex`}
                >
                  <div className="bg-slate-950/25 text-slate-50 rounded-2xl p-2 mb-2">
                    <MarkdownDisplay
                      markdownText={messages[messages.length - 2].content}
                    />
                  </div>
                </div>
              )}
              {messages.length >= 1 && (
                <div
                  className={`${messages[messages.length - 1].role === "user" ? "justify-end" : "justify start"} flex`}
                >
                  <div className="bg-slate-950/25 text-slate-50 rounded-2xl p-2 mt-2">
                    <MarkdownDisplay
                      markdownText={messages[messages.length - 1].content}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-fit bg-slate-950/25 mx-auto space-y-4 border-none px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <FooterText className="hidden sm:block text-slate-50 border-none" />
        </div>
      </div> */}
    </div>
  );
}
