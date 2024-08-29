import {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";
import { FooterText } from "./footer";
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
  isAtBottom,
  scrollToBottom,
}: any) => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const buttonRef = useRef(null);
  const textAreaRef = useRef(null);


  useEffect(() => {
    if (buttonRef.current) {
      // eslint-disable-next-line
      const width = (buttonRef.current as any).offsetWidth;
      setButtonWidth(width);
    }
  }, [buttonRef]);

  useEffect(() => {
    if (textAreaRef.current && buttonWidth) {
      // eslint-disable-next-line
      (textAreaRef.current as any).style.paddingRight = `${buttonWidth + 10}px`; // add 10px for some extra space
    }
  }, [buttonWidth]);

  useEffect(() => {
    // eslint-disable-next-line
    const textArea = textAreaRef.current as any;
    if (!textArea) return;

    // Reset the height to shrink if text is deleted:
    textArea.style.height = "auto";

    textArea.style.height =
      textArea.scrollHeight < 200 ? textArea.scrollHeight + "px" : "200px";
  }, [input]);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className=" space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <form className="relative rounded-xl shadow-sm">
            <Textarea
              ref={textAreaRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              placeholder="Escriu una pregunta..."
              // className="block w-full rounded-xl border-0 py-6 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 resize-none"
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
                  {status === "awaiting_message"
                    ? "Enviar"
                    : "Generant resposta"}
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
