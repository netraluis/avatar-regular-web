import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Textarea from "react-textarea-autosize";

interface TextAreaFormProps {
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  submitMessage: () => void;
  status: string;
}

export const TextAreaForm = ({
  handleInputChange,
  handleKeyDown,
  input,
  submitMessage,
  status,
}: TextAreaFormProps) => {
  const textAreaRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = (e: any) => {
    e.preventDefault();
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
          if (audioBlob.size > 0) {
            transcribeAudio(audioBlob);
          }
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = (e: any, toTranscribe: boolean) => {
    e.preventDefault();
    if (mediaRecorder.current) {
      if (!toTranscribe) {
        mediaRecorder.current.ondataavailable = null;
      }
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audioFile", audioBlob);
      formData.append("language", "ca"); // Pass the language

      const response = await fetch("/api/voice-transcription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error during transcription");
      }

      const data = await response.json();
      simulateInputChange(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  };

  const simulateInputChange = (newInputValue: string) => {
    const syntheticEvent = {
      target: {
        value: newInputValue,
      },
    };
    handleInputChange(syntheticEvent as ChangeEvent<HTMLTextAreaElement>);
  };

  const sendMessage = (e: any) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-muted/30 dark:bg-background/80 duration-300 ease-in-out animate-in">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form className="relative rounded-xl shadow-sm">
            <Textarea
              ref={textAreaRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              placeholder="Escriu una pregunta..."
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={handleInputChange}
            />
            <div className="absolute right-0 top-[13px] sm:right-4">
              {!input && status === "awaiting_message" ? (
                !recording ? (
                  <Button onClick={(e) => startRecording(e)}>
                    <MicrophoneIcon
                      className="ml-0.5 h-5 w-5 mr-1"
                      aria-hidden="true"
                    />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={(event) => stopRecording(event, false)}
                      className="mr-5"
                    >
                      <XMarkIcon
                        className="ml-0.5 h-5 w-5 mr-1"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button onClick={(event) => stopRecording(event, true)}>
                      <CheckIcon
                        className="ml-0.5 h-5 w-5 mr-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </>
                )
              ) : (
                <Button
                  disabled={status !== "awaiting_message"}
                  onClick={sendMessage}
                >
                  {status === "awaiting_message" ? (
                    <PaperAirplaneIcon
                      className="ml-0.5 h-5 w-5 mr-1"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowPathIcon
                      className="ml-0.5 h-5 w-5 animate-spin mr-1"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
