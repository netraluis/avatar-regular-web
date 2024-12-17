import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { useTeamAssistantContext } from "./context/teamAssistantContext";
import Avatar from "./avatar";

export function EmptyScreen({ children }: { children: React.ReactNode }) {
  const { data } = useTeamAssistantContext();

  if (!data?.welcome)
    return (
      <div className="w-full flex justify-center content-center self-center justify-items-center rounded-lg">
        <div className="h-16"></div>
        <ChatBubbleBottomCenterIcon
          className="ml-0.5 w-9 animate-pulse mr-1 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );

  switch (data?.welcomeType) {
    case "BUBBLE":
      return (
        <div className=" mx-auto max-w-2xl px-4">
          <div className="h-16"></div>
          <div className="pb-8 flex justify-center">
            <div className="flex items-end space-x-2 relative my-4">
              <Avatar
                className="w-12 h-12"
                imageUrl={
                  data?.avatarUrl
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.avatarUrl}`
                    : "/avatar.png"
                }
                roleName=""
              ></Avatar>
              <div className="flex flex-col">
                {data?.welcome[0]?.text &&
                  data?.welcome[0]?.text.map((wel, index) => (
                    <div
                      className="mt-3 bg-green-100 p-3 rounded-xl p-4"
                      key={index}
                    >
                      <p className="text-base">
                        {" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: wel,
                          }}
                        />
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="px-14">{children}</div>
        </div>
      );
    default:
      return (
        <div className=" mx-auto max-w-2xl px-4">
          <div className="h-16"></div>
          <div className="flex flex-col gap-2 rounded-lg bg-background p-8 w-full ">
            <div className="ml-12 mt-3.5 flex mb-5 ">
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.welcome[0]?.text[0] || "hola",
                }}
              />
            </div>
          </div>
          <div className="px-8">{children}</div>
        </div>
      );
  }
}
