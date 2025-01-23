"use client";

import { ExternalLink } from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

interface ConnectMenu {
  share: string;
}

const connectMenu = (connectLayout: ConnectMenu) => [
  {
    name: `${connectLayout.share}`,
    href: "share",
    icon: ExternalLink,
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const connectNav = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.CONNECT.LAYOUT.menu",
  );
  const connectLayout = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.CONNECT.LAYOUT",
  );

  const navItems = connectMenu(connectNav);
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  return (
    <OnlyTitleLayout
      cardTitle={connectLayout.title}
      cardDescription={connectLayout.description}
    >
      <>
        <SideDashboardLayout
          navItems={navItems}
          comparatePathName={comparatePathName}
          absolutePath={absolutePath}
        />
        <div className="flex-1 flex flex-col overflow-auto scrollbar-hidden">
          {children}
        </div>
      </>
    </OnlyTitleLayout>
  );
}
