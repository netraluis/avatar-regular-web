import { DashboardLanguageProvider } from "@/components/context/dashboardLanguageContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLanguageProvider>
      <DashboardHeader>{children}</DashboardHeader>
    </DashboardLanguageProvider>
  );
}
