"use server";
import { AppProvider } from "@/components/context/appContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  console.log({ userId });

  if (!userId) return <div>not log in</div>;

  // const team = await getTeamsByUser(data?.user.id);
  // console.log({ team });
  // if (!team) return <div>no team</div>;

  return (
    <AppProvider user={{ id: userId }}>
      <DashboardHeader userId={userId}>{children}</DashboardHeader>
    </AppProvider>
  );
}
