"use client";

import { User, Key } from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

const userLayout = {
  title: "Configuració",
  description:
    "Gestiona la configuració del teu compte i ajusta les preferències",
  general: "General",
  security: "Seguretat",
};

interface UserMenu {
  general: string;
}

const userMenu = (connectLayout: UserMenu) => [
  {
    name: `${connectLayout.general}`,
    href: "general",
    icon: User,
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { t } = useDashboardLanguage();
    const userNav = t(
      "app.USER.LAYOUT.menu",
    );

  const navItems = userMenu(userNav);
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  return (
    <OnlyTitleLayout
      cardTitle={userLayout.title}
      cardDescription={userLayout.description}
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
