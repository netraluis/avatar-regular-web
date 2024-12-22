"use client";

import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { CustomCard } from "@/components/custom-card";
import {
  LanguageType,
  MenuFooter,
  MenuHeaderType,
  Prisma,
} from "@prisma/client";
import { ExtendedTextHref, MenuSettings } from "./menu-settings";
import { MenuHeaderFooter } from "./menu-footer";
import { useState, useEffect } from "react";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";

export default function Interface() {
  const { t } = useDashboardLanguage();
  const interfaceText = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE");
  const {
    state: { teamSelected, user },
  } = useAppContext();

  const updateTeam = useUpdateTeam();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [menuHeaderItems, setMenuHeaderItems] = useState<ExtendedTextHref[]>(
    [],
  );
  const [menuItemsHeaderSave, setMenuItemsHeaderSave] = useState<
    ExtendedTextHref[]
  >([]);
  const [menuBodyItems, setMenuBodyItems] = useState<ExtendedTextHref[]>([]);
  const [menuItemsBodySave, setMenuItemsBodySave] = useState<
    ExtendedTextHref[]
  >([]);

  const [headerFoot, setHeaderFoot] = useState<string>("");
  const [headerFootDefault, setHeaderFootDefault] = useState<string>("");

  useEffect(() => {
    const menuHeadersItems =
      teamSelected?.menuHeader?.find(
        (menu) => menu.type === MenuHeaderType.HEADER,
      )?.textHref || [];
    setMenuHeaderItems(menuHeadersItems);
    setMenuItemsHeaderSave(menuHeadersItems);

    const menuBodyItems =
      teamSelected?.menuHeader?.find(
        (menu) => menu.type === MenuHeaderType.BODY,
      )?.textHref || [];
    setMenuBodyItems(menuBodyItems);
    setMenuItemsBodySave(menuBodyItems);

    const headerFooter = teamSelected?.menuFooter?.find(
      (menuFooter: MenuFooter) =>
        menuFooter.language === teamSelected?.defaultLanguage,
    )?.text;

    setHeaderFootDefault(headerFooter || "");
    setHeaderFoot(headerFooter || "");
  }, [teamSelected]);

  const createMenuUpsert = (
    menuItems: ExtendedTextHref[],
    menuType: MenuHeaderType,
    teamSelectedId: string,
  ) => {
    return {
      where: {
        type_teamId: {
          type: menuType, // O el tipo que corresponda
          teamId: teamSelectedId,
        },
      },
      update: {
        textHref: {
          deleteMany: {
            id: {
              notIn: [],
            },
          },
          create: menuItems.map((item) => {
            return {
              id: item.id,
              numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
              hrefLanguages: {
                create: item.hrefLanguages.map((hrefLanguage) => {
                  return {
                    text: hrefLanguage.text,
                    href: hrefLanguage.href,
                    language: hrefLanguage.language,
                  };
                }),
              },
            };
          }),
        },
      },
      create: {
        type: menuType,
        textHref: {
          create: menuItems.map((item) => {
            return {
              // text: item.text,
              // href: item.href,
              numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
              hrefLanguages: {
                create: item.hrefLanguages.map((hrefLanguage) => ({
                  // id: hrefLanguage.id,
                  text: hrefLanguage.text,
                  href: hrefLanguage.href,
                  language: hrefLanguage.language,
                  // textHrefId: hrefLanguage.textHrefId,
                })),
              },
            };
          }),
        },
      },
    };
  };

  const createHeaderFooter = (
    headerFoot: string,
    teamSelectedId: string,
    teamSelectedLanguage: LanguageType,
  ) => {
    return {
      upsert: {
        where: {
          language_teamId: {
            teamId: teamSelectedId,
            language: teamSelectedLanguage,
          },
        },
        update: {
          text: headerFoot,
        },
        create: {
          text: headerFoot,
          language: teamSelectedLanguage,
        },
      },
    };
  };

  const menuSaveHandler = async () => {
    setLoading(true);
    if (!teamSelected) return setLoading(false);
    const updateObject: Prisma.TeamUpdateInput = {};
    const menuHeader = [];
    if (menuItemsHeaderSave !== menuHeaderItems) {
      menuHeader.push(
        createMenuUpsert(
          menuHeaderItems,
          MenuHeaderType.HEADER,
          teamSelected.id,
        ),
      );
    }

    if (menuItemsBodySave !== menuBodyItems) {
      menuHeader.push(
        createMenuUpsert(menuBodyItems, MenuHeaderType.BODY, teamSelected.id),
      );
    }

    if (menuHeader.length > 0) {
      updateObject.menuHeader = { upsert: menuHeader };
    }

    if (headerFootDefault !== headerFoot) {
      updateObject.menuFooter = createHeaderFooter(
        headerFoot,
        teamSelected.id,
        teamSelected.defaultLanguage,
      );
    }

    if (teamSelected && user?.user.id) {
      await updateTeam.updateTeam(teamSelected.id, updateObject, user.user.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    setHasChanges(
      menuItemsHeaderSave !== menuHeaderItems ||
        menuItemsBodySave !== menuBodyItems ||
        headerFootDefault !== headerFoot,
    );
  }, [headerFoot, menuHeaderItems, menuBodyItems]);

  return (
    <CustomCard
      title={interfaceText.menu.headerTitle}
      description={interfaceText.menu.headerDescription}
      action={menuSaveHandler}
      loading={loading}
      valueChange={hasChanges}
    >
      <MenuSettings
        menuType={MenuHeaderType.HEADER}
        loading={loading}
        menuItems={menuHeaderItems}
        setMenuItems={setMenuHeaderItems}
      />
      <MenuSettings
        menuType={MenuHeaderType.BODY}
        loading={loading}
        menuItems={menuBodyItems}
        setMenuItems={setMenuBodyItems}
      />
      <MenuHeaderFooter
        loading={loading}
        headerFoot={headerFoot}
        setHeaderFoot={setHeaderFoot}
      />
    </CustomCard>
  );
}
