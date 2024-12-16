"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { TeamSettingsProvider } from "@/components/context/teamSettingsContext";
import { useAppContext } from "@/components/context/appContext";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { TitleLayout } from "@/components/layouts/title-layout";
import { teamsSettingsNav } from "@/lib/helper/navbar";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const teamSettings = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT");
  const menu = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT.menu");

  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[3];
  const absolutePath = pathname.split("/").slice(1, 4).join("/");

  const { state } = useAppContext();

  return (
    <TitleLayout
      cardTitle={teamSettings.cardTitle}
      cardDescription={teamSettings.cardDescription}
      urlPreview={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${state.teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${state.teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
    >
      <>
        <SideDashboardLayout
          navItems={teamsSettingsNav(menu)}
          comparatePathName={comparatePathName}
          absolutePath={absolutePath}
        />
        <div className="flex-1 scrollbar-hidden overflow-auto px-4 w-full">
          {children}
        </div>
      </>
    </TitleLayout>
  );
}

export default function ProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TeamSettingsProvider>
      <Layout>{children}</Layout>
    </TeamSettingsProvider>
  );
}
