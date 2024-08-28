import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Button from "./button";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      const width = (buttonRef.current as any).offsetWidth;
      setButtonWidth(width);
    }
  }, [buttonRef]);

  useEffect(() => {
    if (textAreaRef.current && buttonWidth) {
      (textAreaRef.current as any).style.paddingRight = `${buttonWidth + 10}px`; // add 10px for some extra space
    }
  }, [buttonWidth]);

  useEffect(() => {
    const textArea = textAreaRef.current as any;
    if (!textArea) return;

    // Reset the height to shrink if text is deleted:
    textArea.style.height = "auto";

    textArea.style.height =
      textArea.scrollHeight < 200 ? textArea.scrollHeight + "px" : "200px";
  }, [input]);

  return (
    <form className="mx-2">
      <div className="relative rounded-xl shadow-sm">
        <textarea
          ref={textAreaRef}
          name="account-number"
          id="account-number"
          className="block w-full rounded-xl border-0 py-6 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 resize-none"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={input}
          placeholder="Escriu una pregunta..."
          rows={1}
        />
        <div className="absolute inset-y-0 right-0 flex items-end">
          <div className="flex justify-center p-2.5">
            <Button
              ref={buttonRef}
              disabled={status !== "awaiting_message"}
              onClick={submitMessage}
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
                {status === "awaiting_message" ? "Enviar" : "Generant resposta"}
              </div>
            </Button>
          </div>
        </div>
      </div>
      {/* <p className="mt-2 text-sm text-zinc-500 flex justify-center">
        Totes les respostes en aquesta conversa estan generades mitjançant una
        Intel·ligència Artificial (AI)
      </p> */}
    </form>
  );
};
