"use client";
import { useAppContext } from "@/components/context/appContext";
import {
  DashboardLanguageProvider,
  Language,
} from "@/components/context/dashboardLanguageContext";
import DashboardHeader from "@/components/layouts/dashboard-layout";

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
      <DashboardHeader>{children}</DashboardHeader>
    </DashboardLanguageProvider>
  );
}
