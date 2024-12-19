"use client";

import { MenuHeaderType } from "@prisma/client";
import { CustomCard } from "@/components/custom-card";
import { WelcomeMessage } from "./welcome-message";
import { MenuSettings } from "./menu-settings";
import { MenuHeaderFooter } from "./menu-footer";
import { Banner } from "./banner";
import { Footer } from "./footer";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Interface() {
  const { t } = useDashboardLanguage();
  const interfaceText = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE");

  return (
    <div>
      <WelcomeMessage />
      <CustomCard
        title={interfaceText.menu.headerTitle}
        description={interfaceText.menu.headerDescription}
      >
        <MenuSettings menuType={MenuHeaderType.HEADER} />
        <MenuSettings menuType={MenuHeaderType.BODY} />
        <MenuHeaderFooter />
      </CustomCard>
      <Banner />
      <Footer />
    </div>
  );
}
