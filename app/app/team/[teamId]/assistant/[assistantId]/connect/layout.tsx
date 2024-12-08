"use client";

import { ExternalLink } from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";

const connectLayout = {
  title: "Connecta",
  description: "Gestiona com compartir i integrar el teu assistent amb altres eines i plataformes.",
  share: 'Comparteix'
};

const navItems = [
  { name: `${connectLayout.share}`, href: "share", icon: ExternalLink },
  // { name: "Analytics", href: "analytics", icon: PieChart },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </>
    </OnlyTitleLayout>
  );
}
