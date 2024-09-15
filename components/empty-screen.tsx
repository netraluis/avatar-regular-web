import { useContext } from "react";
import { GlobalContext } from "./context/globalContext";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";

export function EmptyScreen({ children }: { children: React.ReactNode }) {
  const { domainData } = useContext(GlobalContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {domainData?.welcome ? (
        <div className=" mx-auto max-w-2xl px-4">
          <div className="flex flex-col gap-2 rounded-lg bg-background p-8 w-full ">
            <div className="ml-12 mt-3.5 flex mb-5 ">
              <h1 className="text-3xl font-bold text-slate-900">
                {domainData?.name}
              </h1>
            </div>
          </div>
          <div className="px-8">{children}</div>
        </div>
      ) : (
        <div className="w-full flex justify-center content-center self-center justify-items-center rounded-lg">
          <ChatBubbleBottomCenterIcon
            className="ml-0.5 w-9 animate-pulse mr-1 text-slate-400"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
