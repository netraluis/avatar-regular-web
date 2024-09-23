import DashboardHeader from "@/components/layouts/dashboard-layout";
import { assistantsTeamSelected, teams } from "@/components/mockData";

export default function Dashboard({
  params,
}: {
  params: { teamId: string; assistantId: string };
}) {
  console.log("hola", { params });
  const teamSelected = teams.find((team) => team.id === params.teamId);

  const assistantSelected = assistantsTeamSelected.find(
    (assistant) => assistant.id === params.assistantId,
  );

  return (
    <DashboardHeader
      teams={teams}
      teamSelected={teamSelected}
      assistantSelected={assistantSelected}
      assistantId={params.assistantId}
    >
      <h1>hola</h1>
    </DashboardHeader>
  );
}
