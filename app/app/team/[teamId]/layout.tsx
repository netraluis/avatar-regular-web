import { AppProvider } from "@/components/context/appContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <DashboardHeader>{children}</DashboardHeader>
    </AppProvider>
  );
}
