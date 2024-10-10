"use client";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { ButtonScrollToBottom } from "./button-scroll-to-bottom";
import { FooterText } from "./footer";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { EmptyScreen } from "./empty-screen";
import { GlobalContext } from "./context/globalContext";
import WelcomeCard from "./welcome-card";

export default function Welcome() {
  const { setState, domainData } = useContext(GlobalContext);

  const { messagesRef, scrollRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div ref={messagesRef}>
        <EmptyScreen>
          {domainData?.welcomeCards ? (
            <WelcomeCard />
          ) : (
            <Button
              onClick={async () => {
                setState({ position: 2 });
              }}
            >
              {/* <div className="w-full h-px" ref={visibilityRef} /> */}
              <HandThumbUpIcon
                className="ml-0.5 mr-1 h-5 w-5"
                aria-hidden="true"
              />{" "}
              Entesos i començar
            </Button>
          )}
        </EmptyScreen>
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className=" space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <div className="relative rounded-xl shadow-sm"></div>
            <FooterText className="hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
