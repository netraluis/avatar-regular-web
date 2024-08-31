import { useContext, useEffect, useRef, useState } from "react";
import { useAssistant as useAssistant } from "ai/react";
import { TextAreaForm } from "./textAreaForm";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { cn } from "@/lib/utils";
import { ChatList } from "./chat-list";
// import { EmptyScreen } from './empty-screen';

import OpenAI from "openai";
import { GlobalContext } from "./context/globalContext";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ConversationRecipient() {
  const { setActualThreadId } = useContext(GlobalContext);
  const [recording, setRecording] = useState(false); // Track recording state
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  // eslint-disable-next-line
  // const scrollRef = useRef<any>(null);

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    append,
  } = useAssistant({
    api: "/api/assistant-stream",
    body: {
      assistantId: undefined,
    },
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  // eslint-disable-next-line
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  // eslint-disable-next-line
  const onClickButton = (e: any) => {
    submitMessage(e);
  };

  // eslint-disable-next-line
  const handleClick = async (e: any, question: string) => {
    append({ content: question, role: "user" });
  };

  useEffect(() => {
    if (threadId) {
      setActualThreadId(threadId);
    }
  }, [threadId, setActualThreadId]);

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          audioChunks.current = [];
          transcribeAudio(audioBlob);
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  function stopRecording() {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  }

  async function transcribeAudio(audioBlob: Blob) {
    try {
      // Convert Blob to File
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });
      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
      });
      const transcription = response.text;
      console.log("Transcription: ", transcription);
      // setInput(transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  }

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] h-screen"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px]  pt-[100px]")}
        ref={messagesRef}
      >
        {messages.length ? <ChatList messages={messages} /> : <></>}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>

      <TextAreaForm
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        input={input}
        status={status}
        submitMessage={submitMessage}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
