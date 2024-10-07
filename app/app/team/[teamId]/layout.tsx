import { AppProvider } from "@/components/context/appContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";
import { getTeam } from "@/lib/data/team";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const team = getTeam();

  return (
    <AppProvider>
      <DashboardHeader team={team}>{children}</DashboardHeader>
    </AppProvider>
  );
}
