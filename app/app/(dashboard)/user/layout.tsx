"use client";

import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { TitleLayout } from "@/components/layouts/title-layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const userLayout = t("app.USER.LAYOUT");

  return (
    <TitleLayout
      cardTitle={userLayout.title}
      cardDescription={userLayout.description}
    >
      <div className="overflow-auto scrollbar-hidden w-full px-4">
        {children}
      </div>
    </TitleLayout>
  );
}
