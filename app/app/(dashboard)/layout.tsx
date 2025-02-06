"use client";
import { useAppContext } from "@/components/context/appContext";
import {
  DashboardLanguageProvider,
  Language,
} from "@/components/context/dashboardLanguageContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const {
    state: { userLocal },
  } = useAppContext();

  const split = pathname.split("/")[pathname.split("/").length - 1];

  // const absolutePath = pathname.split("/").slice(pathname.split("/").length -2, pathname.split("/").length -0).join("/");

  const language: Language = (userLocal?.language as Language) || Language.EN;

  if (split === "new" || split === "instructions" || split === "files") {
    return (
      <DashboardLanguageProvider userLanguage={language}>
        <div className="flex justify-center h-screen">
          <div className="flex">{children}</div>
        </div>
      </DashboardLanguageProvider>
    );
  }

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
