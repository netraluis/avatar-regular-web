"use client";
import { useAppContext } from "@/components/context/appContext";
import {
  DashboardLanguageProvider,
  Language,
} from "@/components/context/dashboardLanguageContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    state: { userLocal },
  } = useAppContext();

  const language: Language = (userLocal?.language as Language) || Language.EN;

  return (
    <DashboardLanguageProvider userLanguage={language}>
      <SidebarProvider>
        <AppSidebar />
        <main className="h-screen w-full relative">
          <SidebarTrigger className="absolute" />
          {children}
        </main>
      </SidebarProvider>
    </DashboardLanguageProvider>
  );
}
