import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import Textarea from "react-textarea-autosize";
import { FooterText } from "./footer";

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
  const buttonRef = useRef(null);
  const textAreaRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga durante la transcripción
  const [error, setError] = useState<string | null>(null); // Manejo de errores
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  // Iniciar la grabación
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
        setError("No se pudo acceder al micrófono");
      });
  }

  // Detener la grabación
  function stopRecording() {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  }

  // Transcripción de audio mediante la API en el servidor
  async function transcribeAudio(audioBlob: Blob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audioFile", audioBlob);
      formData.append("language", "ca"); // Pasar el idioma como un campo

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error during transcription");
      }

      const data = await response.json();
      console.log("Transcription received: ", data.transcription);
      simulateInputChange(data.transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setError("Error al transcribir el audio");
    } finally {
      setLoading(false);
    }
  }

  // Simular el cambio de input con el texto transcrito
  function simulateInputChange(newInputValue: string) {
    const syntheticEvent = {
      target: { value: newInputValue },
    };
    handleInputChange(syntheticEvent as ChangeEvent<HTMLTextAreaElement>);
  }

  useEffect(() => {
    if (input && !recording && !loading) {
      console.log("Input value changed: ", input);
      submitMessage(); // Enviar el mensaje solo cuando la transcripción esté lista
    }
  }, [input, recording, loading]);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className=" space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form
            className="relative rounded-xl shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              submitMessage();
            }}
          >
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
              disabled={loading} // Deshabilitar si está transcribiendo
            />
            <div className="absolute right-0 top-[13px] sm:right-4">
              <Button
                ref={buttonRef}
                disabled={status !== "awaiting_message" || loading}
                onClick={recording ? stopRecording : startRecording}
              >
                {loading ? (
                  <ArrowPathIcon
                    className="ml-0.5 h-5 w-5 animate-spin mr-1"
                    aria-hidden="true"
                  />
                ) : recording ? (
                  <MicrophoneIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                ) : (
                  <PaperAirplaneIcon
                    className="ml-0.5 h-5 w-5 mr-1"
                    aria-hidden="true"
                  />
                )}
                <div className="hidden sm:block">
                  {loading
                    ? "Transcribiendo..."
                    : recording
                      ? "Grabando..."
                      : "Enviar"}
                </div>
              </Button>
            </div>
          </form>
          {error && <p className="text-red-500">{error}</p>}
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
