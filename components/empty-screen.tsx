import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { useTeamAssistantContext } from "./context/teamAssistantContext";

export function EmptyScreen({ children }: { children: React.ReactNode }) {
  const { data } = useTeamAssistantContext();

  if (!data?.welcome)
    return (
      <div className="w-full flex justify-center content-center self-center justify-items-center rounded-lg">
        <ChatBubbleBottomCenterIcon
          className="ml-0.5 w-9 animate-pulse mr-1 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );

  switch (data?.welcome[0]?.type) {
    case "GLOVE":
      return (
        <div className=" mx-auto max-w-2xl px-4">
          <div className="rounded-lg pb-8">
            {/* <div className="ml-12 mt-3.5 flex mb-5 "> */}
            {data?.welcome.map((wel, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 relative my-4"
              >
                {/* <Avatar className="w-12 h-12">
                    {domainData?.welcomeDesign?.data?.length &&
                      domainData?.welcomeDesign?.data?.length - 1 === index && (
                        <img
                          src="/avatar-photo.jpeg"
                          alt="Avatar"
                          className="rounded-full "
                        />
                      )}
                  </Avatar> */}

                <div className="bg-green-100 p-3 rounded-xl p-4">
                  <p className="text-base">
                    {" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: wel.text[0],
                      }}
                    />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-14">{children}</div>
        </div>
      );
    default:
      return (
        <div className=" mx-auto max-w-2xl px-4">
          <div className="flex flex-col gap-2 rounded-lg bg-background p-8 w-full ">
            <div className="ml-12 mt-3.5 flex mb-5 ">
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.welcome[0]?.text[0] || "",
                }}
              />
            </div>
          </div>
          <div className="px-8">{children}</div>
        </div>
      );
  }
}
