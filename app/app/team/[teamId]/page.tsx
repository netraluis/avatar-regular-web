import DashboardHeader from "@/components/layouts/dashboard-layout";
import { teams } from "@/components/mockData";

export default function Dashboard({ params }: { params: { teamId: string } }) {
  const teamSelected = teams.find((team) => team.id === params.teamId);

  console.log("hola", { params });

  return (
    <DashboardHeader teamSelected={teamSelected} teams={teams}>
      <h1>hola</h1>
    </DashboardHeader>
  );
}

export async function generateStaticParams() {
  return teams.map((team) => ({
    teamId: team.id,
  }));
}
