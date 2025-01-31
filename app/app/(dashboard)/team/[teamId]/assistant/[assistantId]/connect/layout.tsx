"use client";

import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { TitleLayout } from "@/components/layouts/title-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const connectLayout = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.CONNECT.LAYOUT",
  );

  return (
    <TitleLayout
      cardTitle={connectLayout.title}
      cardDescription={connectLayout.description}
    >
      <div className="flex-1 flex flex-col overflow-auto scrollbar-hidden">
        {children}
      </div>
    </TitleLayout>
  );
}
