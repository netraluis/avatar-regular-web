import { useContext } from "react";
import { GlobalContext } from "./context/globalContext";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@/components/ui/avatar";

export function EmptyScreen({ children }: { children: React.ReactNode }) {
  const { domainData } = useContext(GlobalContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {domainData?.welcome ? (
        domainData?.welcomeDesign?.type === "glove" ? (
          <div className=" mx-auto max-w-2xl px-4">
            <div className="rounded-lg pb-8">
              {/* <div className="ml-12 mt-3.5 flex mb-5 "> */}
              {domainData?.welcomeDesign?.data?.map((message, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 relative my-4"
                >
                  <Avatar className="w-12 h-12">
                    {domainData?.welcomeDesign?.data?.length &&
                      domainData?.welcomeDesign?.data?.length - 1 === index && (
                        <img
                          src="/avatar-photo.jpeg"
                          alt="Avatar"
                          className="rounded-full "
                        />
                      )}
                  </Avatar>

                  <div className="bg-green-100 p-3 rounded-xl p-4">
                    <p className="text-base">
                      {" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: message,
                        }}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-14">{children}</div>
          </div>
        ) : (
          <div className=" mx-auto max-w-2xl px-4">
            <div className="flex flex-col gap-2 rounded-lg bg-background p-8 w-full ">
              <div className="ml-12 mt-3.5 flex mb-5 ">
                <div
                  dangerouslySetInnerHTML={{
                    __html: domainData?.welcome || "",
                  }}
                />
              </div>
            </div>
            <div className="px-8">{children}</div>
          </div>
        )
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
