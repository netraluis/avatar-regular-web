"use server";
import { AppProvider } from "@/components/context/appContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";
import { getTeamsByUser } from "@/lib/data/team";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  if (!data?.user) return <div>not log in</div>;

  const team = await getTeamsByUser(data?.user.id);
  console.log({ team });
  if (!team) return <div>no team</div>;

  return (
    <AppProvider>
      <DashboardHeader teams={team}>{children}</DashboardHeader>
    </AppProvider>
  );
}
