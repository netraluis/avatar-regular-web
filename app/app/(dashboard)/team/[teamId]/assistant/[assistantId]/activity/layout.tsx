"use client";

import { Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

interface AssistantSettingsText {
  chatLogs: string;
}

const activityMenu = (activityLayout: AssistantSettingsText) => [
  {
    name: `${activityLayout.chatLogs}`,
    href: "chat-logs",
    icon: Inbox,
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const assistantSettingsNav = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.ACTIVITY.LAYOUT.menu",
  );
  const activityLayout = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.ACTIVITY.LAYOUT",
  );

  const navItems = activityMenu(assistantSettingsNav);
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  return (
    <OnlyTitleLayout
      cardTitle={activityLayout.title}
      cardDescription={activityLayout.description}
    >
      <>
        <SideDashboardLayout
          navItems={navItems}
          comparatePathName={comparatePathName}
          absolutePath={absolutePath}
        />
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </>
    </OnlyTitleLayout>
  );
}
