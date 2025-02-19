import ChatWidget from "@/app/chatbot-widget/chat-widget";
import { getAssistantByField } from "@/lib/data/assistant";
import { getTeamForBubble } from "@/lib/data/team";
import { LanguageType } from "@prisma/client";

export default async function Widget({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const teamId = searchParams.teamId || "727ec031-1090-465e-9bf3-ac955364a465";
  const assistantId =
    searchParams.assistantId || "a9ac7294-412a-4839-b2e3-456dac65f68c";
  const language = searchParams.language || "ca";

  const data = await getAssistantByField(
    { id: assistantId },
    language.toUpperCase() as LanguageType,
  );

  const team = await getTeamForBubble(teamId);

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="h-screen w-screen bg-transparent flex justify-end items-end">
      {/* <h1 className="text-4xl font-bold mb-4">Welcome to our website</h1>
        <p className="mb-4">This is the main content of the page.</p> */}
      <ChatWidget
        language={language as "en" | "ca"}
        teamId={teamId}
        assistantId={assistantId}
        data={data}
        team={team}
      />
    </div>
  );
}

// https://app.netraluis.com/team/727ec031-1090-465e-9bf3-ac955364a465/assistant/a9ac7294-412a-4839-b2e3-456dac65f68c/settings/general
