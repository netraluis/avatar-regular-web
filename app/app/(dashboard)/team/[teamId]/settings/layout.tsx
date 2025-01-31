"use client";

import * as React from "react";
import { TeamSettingsProvider } from "@/components/context/teamSettingsContext";
import { TitleLayout } from "@/components/layouts/title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const teamSettings = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT");

  return (
    <TitleLayout
      cardTitle={teamSettings.cardTitle}
      cardDescription={teamSettings.cardDescription}
    >
      <div className="scrollbar-hidden overflow-auto px-4 w-full">
        {children}
      </div>
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
