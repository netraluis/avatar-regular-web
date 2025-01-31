"use client";

import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { TitleLayout } from "@/components/layouts/title-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const activityLayout = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.ACTIVITY.LAYOUT",
  );

  return (
    <TitleLayout
      cardTitle={activityLayout.title}
      cardDescription={activityLayout.description}
    >
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </TitleLayout>
  );
}
