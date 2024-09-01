import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";
import { FooterText } from "./footer";
import Textarea from "react-textarea-autosize";
import OpenAI from "openai";

interface TextAreaFormProps {
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  submitMessage: () => void;
  status: string;
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

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
      console.log("Recording stopped, awaiting transcription...");
    }
  }

  async function transcribeAudio(audioBlob: Blob) {
    try {
      console.log(audioBlob.size, audioBlob.type);

      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });

      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
        language: "ca",
      });

      const transcription = response.text;
      console.log("Transcription received: ", transcription);
      simulateInputChange(transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  }

  function simulateInputChange(newInputValue: string) {
    console.log("Simulating input change with value: ", newInputValue);
    const syntheticEvent = {
      target: {
        value: newInputValue,
      },
    };

    handleInputChange(syntheticEvent as ChangeEvent<HTMLTextAreaElement>);
  }

  useEffect(() => {
    if (input && recording) {
      console.log("Input value changed: ", input);
      submitMessage();
      setRecording(false);
    }
  }, [input]);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
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
            />
            <div className="absolute right-0 top-[13px] sm:right-4">
              <Button
                ref={buttonRef}
                disabled={status !== "awaiting_message"}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
              >
                {status === "awaiting_message" ? (
                  <PaperAirplaneIcon
                    className="ml-0.5 h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowPathIcon
                    className="ml-0.5 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                )}
                <div className="hidden sm:block">
                  {input
                    ? status === "awaiting_message"
                      ? "Enviar"
                      : "Generant resposta"
                    : "Grabar la teva pregunta"}
                </div>
              </Button>
            </div>
          </form>
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
