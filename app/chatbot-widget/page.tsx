import ChatWidget from "@/app/chatbot-widget/chat-widget";

export default function Widget({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const teamId = searchParams.teamId || "02ebd57b-27b0-4103-8a0a-b65607551928";
  const assistantId =
    searchParams.assistantId || "54ab1103-2b72-49fb-a748-3c0c8226365d";
  const language = searchParams.language || "en";
  return (
    <div className="h-screen w-screen bg-transparent flex justify-end items-end">
      {/* <h1 className="text-4xl font-bold mb-4">Welcome to our website</h1>
        <p className="mb-4">This is the main content of the page.</p> */}
      <ChatWidget
        language={language as "en" | "ca"}
        teamId={teamId}
        assistantId={assistantId}
      />
    </div>
  );
}
