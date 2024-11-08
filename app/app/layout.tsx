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
  if (!headersList.get("x-user-id")) {
    return <div>1 no user</div>;
  }
  const userId = headersList.get("x-user-id");
  if (!userId) {
    return <div>2 no user</div>;
  }
  const user = JSON.parse(userId);

  // const team = await getTeamsByUser(data?.user.id);
  // console.log({ team });
  // if (!team) return <div>no team</div>;

  return (
    <AppProvider user={user}>
      <DashboardHeader>{children}</DashboardHeader>
    </AppProvider>
  );
}
