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
      <WelcomeMessage texts={interfaceText.welcomeMessage} />
      <CustomCard
        title={interfaceText.menu.headerTitle}
        description={interfaceText.menu.headerDescription}
      >
        <MenuSettings
          menuType={MenuHeaderType.HEADER}
          texts={interfaceText.menu}
        />
        <MenuSettings
          menuType={MenuHeaderType.BODY}
          texts={interfaceText.menu}
        />
        <MenuHeaderFooter texts={interfaceText.menu} />
      </CustomCard>
      <Banner texts={interfaceText.banner} />
      <Footer texts={interfaceText.footer} />
    </div>
  );
}
