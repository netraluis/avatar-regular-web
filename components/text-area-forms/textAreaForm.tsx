"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  MicrophoneIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Textarea from "react-textarea-autosize";
import { FooterText } from "../footer";
import { TextAreaFormProps } from "@/types/types";
import Recorder from "recorder-js";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

// ** Step 1: Extend the Window interface **
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export const TextAreaForm = ({
  handleInputChange,
  handleKeyDown,
  input,
  submitMessage,
  loading,
  status,
  showFooter = true,
  text,
}: TextAreaFormProps) => {
  const textAreaRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recorderControls = useVoiceVisualizer();
  const { startRecording, stopRecording, clearCanvas } = recorderControls;
  // const [audioURL, setAudioURL] = useState<string | null>(null);
  // const audioRef = useRef<HTMLAudioElement>(null);

  // Refs for Recorder.js
  const audioContext = useRef<AudioContext | null>(null);
  const recorder = useRef<any>(null);

  const startRecordingF = async (e: any) => {
    e.preventDefault();
    startRecording();

    // ** Step 2: Create the AudioContext correctly **
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.error("Web Audio API is not supported in this browser");
      return;
    }

    audioContext.current = new AudioContextClass();
    recorder.current = new Recorder(audioContext.current, {});

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current.init(stream);
      recorder.current.start();
      setRecording(true);
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone: " + error.message);
    }
  };

  const stopRecordingF = async (e: any, toTranscribe: boolean) => {
    e.preventDefault();

    if (recorder.current) {
      const { blob } = await recorder.current.stop();
      setRecording(false);

      if (blob.size > 0) {
        // motivo principal es para testear el audio
        // const url = URL.createObjectURL(blob);
        // setAudioURL(url);

        // Opcional: Reproducir el audio automáticamente
        // if (audioRef.current) {
        //   audioRef.current.src = url;
        //   audioRef.current.play();
        // }

        if (toTranscribe) {
          stopRecording();
          // Proceder con la transcripción
          transcribeAudio(blob);
        } else {
          clearCanvas();
        }
      } else {
        console.error("El blob de audio está vacío.");
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setTranscribing(true);
      const formData = new FormData();
      formData.append("audioFile", audioBlob);
      formData.append("language", "ca"); // Indica el idioma

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
    if (status !== "thread.run.completed") return;
    submitMessage();
  };

  return (
    <div className="absolute inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form className="relative rounded-xl shadow-sm flex items-center px-4 py-[1.3rem] min-h-[60px]">
            {!recording ? (
              <Textarea
                ref={textAreaRef}
                tabIndex={0}
                onKeyDown={(e: any) => {
                  if (status !== "thread.run.completed") return;
                  handleKeyDown(e);
                }}
                placeholder={text.placeholder}
                className="w-full resize-none bg-transparent focus-within:outline-none sm:text-sm "
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
              <div className="flex w-full bg-transparent focus-within:outline-none sm:text-sm">
                <Button
                  className="bg-background text-primary hover:bg-secondary hover:text-primary"
                  onClick={(event) => stopRecordingF(event, false)}
                >
                  <TrashIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                </Button>
                <div className="flex-1 shrink">
                  <VoiceVisualizer
                    controls={recorderControls}
                    height={"40"}
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
                  className="flex-shrink-0 self-end"
                  onClick={(event) => stopRecordingF(event, true)}
                >
                  <CheckIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                  {text.voiceRecordStop}
                </Button>
              </div>
            )}

            {!recording && (
              <div className="flex-shrink-0 self-end">
                {!input && status === "thread.run.completed" ? (
                  <Button
                    disabled={transcribing}
                    onClick={(e) => startRecordingF(e)}
                  >
                    {!transcribing ? (
                      <>
                        <MicrophoneIcon
                          className="ml-0.5 h-5 w-5 mr-1"
                          aria-hidden="true"
                        />
                        {text.voiceRecordStart}
                      </>
                    ) : (
                      <ArrowPathIcon
                        className="ml-0.5 h-5 w-5 animate-spin mr-1"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled={status !== "thread.run.completed" || loading}
                    onClick={sendMessage}
                  >
                    {status === "thread.run.completed" && !loading ? (
                      <>
                        <PaperAirplaneIcon
                          className="ml-0.5 h-5 w-5 mr-1"
                          aria-hidden="true"
                        />
                        {text.sendMessage}
                      </>
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

            {/* 
            motivo principal es para testear el audio
            {audioURL && (
              <audio ref={audioRef} controls src={audioURL}>
                Tu navegador no soporta el elemento de audio.
              </audio>
            )} */}
          </form>
          {showFooter && <FooterText className="hidden sm:block" />}
        </div>
      </div>
    </div>
  );
};
