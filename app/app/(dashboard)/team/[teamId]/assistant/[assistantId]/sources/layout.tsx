"use client";

import {
  Archive,
  CloudUpload,
  HardDrive,
  MessageSquare,
  BookOpen,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

interface SourcesLayout {
  archives: string;
  notion: string;
  googleDrive: string;
  oneDrive: string;
  teams: string;
}

// const archivesLayoutMenu = (archivesLayout:ArchivesLayout) => ([
//   { name: `${archivesLayout.archives}`, href: "archives", icon: Archive },
//   { name: `${archivesLayout.notion}`, href: "notion", icon: BookOpen, commingSoon: true },
//   {
//     name: `${archivesLayout.googleDrive}`,
//     href: "google-drive",
//     icon: HardDrive,
//     commingSoon: true,
//   },
//   { name: `${archivesLayout.oneDrive}`, href: "one-drive", icon: CloudUpload, commingSoon: true },
//   { name: `${archivesLayout.teams}`, href: "teams", icon: MessageSquare, commingSoon: true },
// ]);

const archivesLayoutMenu = (activityLayout: SourcesLayout) => [
  { name: `${activityLayout.archives}`, href: "archives", icon: Archive },
  // { name: "Texts", href: "texts", icon: FileText },
  // { name: "Emails", href: "emails", icon: Mail },
  // { name: "Q&A", href: "qna", icon: MessageSquare },
  {
    name: `${activityLayout.notion}`,
    href: "notion",
    icon: BookOpen,
    commingSoon: true,
  },
  {
    name: `${activityLayout.googleDrive}`,
    href: "google-drive",
    icon: HardDrive,
    commingSoon: true,
  },
  {
    name: `${activityLayout.oneDrive}`,
    href: "one-drive",
    icon: CloudUpload,
    commingSoon: true,
  },
  {
    name: `${activityLayout.teams}`,
    href: "teams",
    icon: MessageSquare,
    commingSoon: true,
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const sourcesLayoutMenu = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SOURCES.LAYOUT.menu",
  );
  const sourcesLayout = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SOURCES.LAYOUT",
  );
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  const navItems = archivesLayoutMenu(sourcesLayoutMenu);

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
