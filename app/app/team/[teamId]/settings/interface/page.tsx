"use client";

import { useAppContext } from "@/components/context/appContext";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LanguageType,
  MenuHeaderType,
  Prisma,
  TextHref,
  HrefLanguages,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { CustomCard } from "@/components/custom-card";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { WelcomeMessage } from "./welcome-message";
import { interfaceText } from "./locale";
import { MenuSettings } from "./menu-settings";
import { MenuHeaderFooter } from "./menu-footer";
import { Banner } from "./banner";

interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const [foot, setFoot] = useState<string>();
  const [welText, setWelText] = useState<string[]>([""]);

  useEffect(() => {
    setFoot(
      teamSelected?.footer?.find(
        (foot) => foot.language === teamSelected?.defaultLanguage,
      )?.text,
    );

    const welcome = teamSelected?.welcome?.find(
      (wel) => wel.language === teamSelected?.defaultLanguage,
    );

    setWelText(welcome?.text || [""]);
  }, [teamSelected, teamSelected?.defaultLanguage]);

  useEffect(() => {
    setPrimaryMenu(
      teamSelected?.menuHeader?.find(
        (menu) => menu.type === MenuHeaderType.HEADER,
      )?.textHref || [],
    );
    setSecondaryMenu(
      teamSelected?.menuHeader?.find(
        (menu) => menu.type === MenuHeaderType.BODY,
      )?.textHref || [],
    );
  }, [teamSelected?.menuHeader]);

  const { data, setData } = useTeamSettingsContext();

  // Estado para los menús
  const [primaryMenu, setPrimaryMenu] = useState<ExtendedTextHref[]>([]);

  const [secondaryMenu, setSecondaryMenu] = useState<ExtendedTextHref[]>([]);

  const menuHandler = (
    menuItem: ExtendedTextHref[],
    menuHeaderType: MenuHeaderType,
  ) => {
    if (!teamSelected?.id) return data;
    const updatedData: Prisma.TeamUpdateInput = {
      ...data,
      menuHeader: {
        upsert: {
          where: {
            type_teamId: {
              type: menuHeaderType, // O el tipo que corresponda
              teamId: teamSelected?.id,
            },
          },
          update: {
            textHref: {
              deleteMany: {
                id: {
                  notIn: [],
                },
              },
              create: menuItem.map((item) => {
                console.log({ item });
                return {
                  id: item.id,
                  numberOrder:
                    menuItem.findIndex((el) => el.id === item.id) + 1,
                  hrefLanguages: {
                    create: item.hrefLanguages.map((hrefLanguage) => {
                      console.log({ hrefLanguage });
                      // if(hrefLanguage.language !== teamSelected?.defaultLanguage){
                      //   return {}
                      // }
                      return {
                        text: hrefLanguage.text,
                        href: hrefLanguage.href,
                        language: hrefLanguage.language,
                        // textHrefId: item.id,
                      };
                    }),
                  },
                };
              }),
            },
          },
          create: {
            type: menuHeaderType,
            textHref: {
              create: menuItem.map((item) => {
                return {
                  // text: item.text,
                  // href: item.href,
                  numberOrder:
                    menuItem.findIndex((el) => el.id === item.id) + 1,
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
        },
      },
    };

    return updatedData;
  };

  const welcomeHandler = () => {
    if (!teamSelected?.id) return data;
    const updatedData: Prisma.TeamUpdateInput = {
      ...data,
      welcome: {
        upsert: {
          where: {
            language_teamId: {
              language: teamSelected?.defaultLanguage || LanguageType.ES, // O el tipo que corresponda
              teamId: teamSelected?.id,
            },
          },
          update: {
            text: welText,
          },
          create: {
            text: welText,
            language: teamSelected?.defaultLanguage || LanguageType.ES,
            description: "",
          },
        },
      },
    };

    return updatedData;
  };

  useEffect(() => {
    const updatedData = menuHandler(primaryMenu, MenuHeaderType.HEADER);
    setData(updatedData);
  }, [primaryMenu]);

  useEffect(() => {
    const updatedData = menuHandler(secondaryMenu, MenuHeaderType.BODY);

    setData(updatedData);
  }, [secondaryMenu]);

  useEffect(() => {
    const updatedData = welcomeHandler();

    setData(updatedData);
  }, [welText]);
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

      <Card>
        <CardHeader>
          <CardTitle>{interfaceText.footer.title}</CardTitle>
          <CardDescription>{interfaceText.footer.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer-message">{interfaceText.footer.text}</Label>
            {teamSelected ? (
              <Textarea
                placeholder={interfaceText.footer.textPlaceholder}
                id="footer-message"
                className="min-h-[100px]"
                value={foot || ""}
                onChange={(e) => {
                  if (!teamSelected?.id) return;
                  setFoot(e.target.value);
                  setData({
                    ...data,
                    footer: foot
                      ? {
                          update: {
                            where: {
                              language_teamId: {
                                teamId: teamSelected.id,
                                language:
                                  teamSelected?.defaultLanguage ||
                                  LanguageType.ES,
                              },
                            },
                            data: {
                              text: e.target.value,
                            },
                          },
                        }
                      : {
                          create: {
                            text: e.target.value,
                            language:
                              teamSelected?.defaultLanguage || LanguageType.ES,
                          },
                        },
                  });
                }}
              />
            ) : (
              <TextAreaCharging />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
