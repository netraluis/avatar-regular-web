"use client";

import { ExternalLink } from "lucide-react";

import { usePathname } from "next/navigation";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { OnlyTitleLayout } from "@/components/layouts/only-title-layout";

const connectLayout = {
  title: "Share",
  description: "Share your account",
};

const navItems = [
  { name: "Share", href: "share", icon: ExternalLink },
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
      <div className="flex sh-full justify-start overflow-auto px-[40px] gap-8 w-full overflow-hidden h-full">
        <SideDashboardLayout
          navItems={navItems}
          comparatePathName={comparatePathName}
          absolutePath={absolutePath}
        />
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </div>
    </OnlyTitleLayout>
  );
}
