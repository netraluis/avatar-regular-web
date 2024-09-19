import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Textarea from "react-textarea-autosize";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { FooterText } from "./footer";
import "audio-recorder-polyfill";

// window.MediaRecorder = window.MediaRecorder || AudioRecorderPolyfill;

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
  const [transcribing, setTranscribing] = useState(false);
  const recorderControls = useVoiceVisualizer();
  const { startRecording, stopRecording, clearCanvas } = recorderControls;
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecordingF = (e: any) => {
    e.preventDefault();
    startRecording();
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
            // Crear una URL para el blob y guardarla en el estado
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);

            // Opcional: Reproducir el audio automáticamente
            if (audioRef.current) {
              audioRef.current.src = url;
              audioRef.current.play();
            }

            // Proceder con la transcripción
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

  const stopRecordingF = (e: any, toTranscribe: boolean) => {
    e.preventDefault();
    if (mediaRecorder.current) {
      if (!toTranscribe) {
        mediaRecorder.current.ondataavailable = null;
        clearCanvas();
      } else {
        stopRecording();
      }
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setTranscribing(true);
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
    } finally {
      setTranscribing(false);
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
    <div className="fixed inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form className="relative rounded-xl shadow-sm">
            {!recording ? (
              <Textarea
                ref={textAreaRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                placeholder="Escriu una pregunta..."
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm "
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={input}
                onChange={handleInputChange}
              />
            ) : (
              <div className="flex min-h-[60px] w-full resize-none bg-transparent px-4 py-[0.65rem] focus-within:outline-none sm:text-sm">
                <Button
                  className="mt-[3px] bg-background text-primary hover:bg-secondary hover:text-primary"
                  onClick={(event) => stopRecordingF(event, false)}
                >
                  <TrashIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                </Button>
                <div className=" flex-1 mx-2 shrink">
                  <VoiceVisualizer
                    controls={recorderControls}
                    height={"48px"}
                    width={"100%"}
                    mainBarColor="#0f172a"
                    secondaryBarColor="#f1f5f9"
                    speed={3}
                    barWidth={5}
                    gap={1}
                    rounded={5}
                    isControlPanelShown={false}
                    isDownloadAudioButtonShown={false}
                    fullscreen={true}
                    onlyRecording={true}
                    isDefaultUIShown={false}
                  />
                </div>

                <Button
                  className="mt-[3px]"
                  onClick={(event) => stopRecordingF(event, true)}
                >
                  <CheckIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            )}

            {!recording && (
              <div className="absolute right-0 top-[13px] sm:right-4 ">
                {!input && status === "awaiting_message" ? (
                  !recording && (
                    <Button onClick={(e) => startRecordingF(e)}>
                      {!transcribing ? (
                        <MicrophoneIcon
                          className={"ml-0.5 h-5 w-5 mr-1"}
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowPathIcon
                          className="ml-0.5 h-5 w-5 animate-spin mr-1"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
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
            )}
            {audioURL && (
              <audio ref={audioRef} controls src={audioURL}>
                Your browser does not support the audio element.
              </audio>
            )}
          </form>
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
