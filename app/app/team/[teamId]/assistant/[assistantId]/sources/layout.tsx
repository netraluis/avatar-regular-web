"use client";

import { Archive, CloudUpload, HardDrive, MessageSquare, BookOpen } from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";

const sourcesLayout = {
  title: "Fonts",
  description:
    "Gestiona les fonts d’informació que l’assistent utilitza per respondre a les consultes dels usuaris. Les fonts carregades ajuden l’assistent a trobar el contingut adequat segons les peticions.",
  archives: "Fitxers",
};

const navItems = [
  { name: `${sourcesLayout.archives}`, href: "archives", icon: Archive },
  // { name: "Texts", href: "texts", icon: FileText },
  // { name: "Emails", href: "emails", icon: Mail },
  // { name: "Q&A", href: "qna", icon: MessageSquare },
  { name: "Notion", href: "notion", icon: BookOpen },
  { name: "Google Drive", href: "google-drive", icon: HardDrive, commingSoon: true },
  { name: "OneDrive", href: "one-drive", icon: CloudUpload, commingSoon: true },
  { name: "teams", href: "teams", icon: MessageSquare, commingSoon: true },
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
      cardTitle={sourcesLayout.title}
      cardDescription={sourcesLayout.description}
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
