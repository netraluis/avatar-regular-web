"use client";

import { useAppContext } from "@/components/context/appContext";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LanguageType,
  MenuHeaderType,
  Prisma,
  TextHref,
  WelcomeType,
  MenuFooter,
  HeaderButtonType,
  HrefLanguages,
} from "@prisma/client";
import { GripVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Reorder, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUserImageType } from "@/types/types";
import { CustomCard } from "@/components/custom-card";
import { UploadImage } from "@/components/upload-image";
import {
  SelectCharging,
  TextAreaCharging,
  InputCharging,
} from "@/components/loaders/loadersSkeleton";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";

const interfaceText = {
  title: "Ajusts del equip",
  description: "Això és com et veuran els altres al lloc.",
  name: "Nom de l'equip",
  nameDescription:
    "Aquest és el teu nom públic. Pot ser el teu nom real o un pseudònim.",
  avatar: {
    title: "Imatges de l'equip",
    description: "Així és com et veuran els altres al lloc.",
    uploadLogo: "Pujar un logotip",
    choose: "Escollir",
    uploadFavicon: "Pujar un favicon",
    recommendedSize: "Mida recomanada 180 × 180",
  },
  welcomeMessage: {
    title: "Al teu missatge de benvinguda",
    description: "Aquest missatge sortira a la seva pàgina de benvinguda",
    linesTitle: "Les lines del welcome",
    line: "Linea",
    addLine: "Afegir linea",
    lineDescription: "Els bubbles es separen per lineas",
  },
  menu: {
    headerTitle: "Menu",
    headerDescription: "Aquest seràn els valors que tindrem al menu del header",
    menuHeaderTitle: "Menu superior",
    menuHeaderTitleDescription:
      "Aquests valors apareixeran primers i més destacats",
    menuBodyTitle: "Menu inferior",
    menuBodyDescription: "Aquests valors apareixeran a la part mitja del menu",
    menuFooterTitle: "Footer del menu",
    menuFooterChangePlan: "Canviar al teu plan",
    menuFooterDescription: "Aquest text apareixara a la part inferior del menu",
    addItem: "Afegir Item",
  },
  banner: {
    title: "Banner de información",
    description: "Disclaimer information situat en el menú",
    buttonText: "Títol botó",
    titleText: "Títol",
    text: "Text del banner",
    textDescription: "Aquest text sera el cos del banner",
  },
  footer: {
    title: "Footer",
    description: "És el texte que apareix al inferior de la pàgina",
    text: "El seu footer",
    textDescription:
      "Aquest texte apareixera just abaix de la seva caixa de text",
  },
};

interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const [foot, setFoot] = useState<string>();
  const [headerFoot, setHeaderFoot] = useState<string>();
  const [headerButton, setHeaderButton] = useState<string>("");
  const [headerButtonTitle, setHeaderButtonTitle] = useState<string>("");
  const [headerButtonText, setHeaderButtonText] = useState<string[]>([""]);
  const [welText, setWelText] = useState<string[]>([""]);
  const [welType, setWelType] = useState<WelcomeType>(WelcomeType.PLAIN);
  const [menuHeaderId, setMenuHeaderId] = useState<string | null>(null);

  const { assistantId } = useParams();

  useEffect(() => {
    setMenuHeaderId(
      teamSelected?.menuHeader?.find(
        (menu) => menu.type === MenuHeaderType.HEADER,
      )?.id || uuidv4(),
    );
  }, [teamSelected]);

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
    setWelType(teamSelected?.welcomeType || WelcomeType.PLAIN);
    setHeaderFoot(
      teamSelected?.menuFooter?.find(
        (menuFooter: MenuFooter) =>
          menuFooter.language === teamSelected?.defaultLanguage,
      )?.text,
    );

    const headerButtonResult = teamSelected?.headerButton?.find(
      (headerButton: any) =>
        headerButton.language === teamSelected?.defaultLanguage,
    );

    setHeaderButton(headerButtonResult?.buttonText || "");
    setHeaderButtonTitle(headerButtonResult?.title || "");
    setHeaderButtonText(headerButtonResult?.text || [""]);
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

  const addPrimaryMenuItem = () => {
    const textHrefId = uuidv4();
    setPrimaryMenu([
      ...primaryMenu,
      {
        id: textHrefId,
        numberOrder: 0,
        menuHeaderId: menuHeaderId,
        hrefLanguages: [
          {
            id: uuidv4(),
            text: "",
            href: "",
            language: teamSelected?.defaultLanguage || LanguageType.ES,
            textHrefId: textHrefId,
          },
        ],
      },
    ]);
  };

  const addSecondaryMenuItem = () => {
    const textHrefId = uuidv4();
    setSecondaryMenu([
      ...secondaryMenu,
      {
        id: textHrefId,
        numberOrder: 0,
        menuHeaderId: menuHeaderId,
        hrefLanguages: [
          {
            id: uuidv4(),
            text: "",
            href: "",
            language: teamSelected?.defaultLanguage || LanguageType.ES,
            textHrefId: textHrefId,
          },
        ],
      },
    ]);
  };

  const addWelcome = () => {
    setWelText([...welText, ""]);
  };

  const updatePrimaryMenuItem = (
    id: string,
    field: "text" | "href",
    value: string,
  ) => {
    setPrimaryMenu(
      primaryMenu.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hrefLanguages: item.hrefLanguages.map((href) =>
              href.textHrefId === id &&
              href.language === teamSelected?.defaultLanguage
                ? { ...href, [field]: value }
                : href,
            ),
          };
        } else {
          return item;
        }
        // return item.id === id ? { ...item, [field]: value } : item,
      }),
    );
  };

  const updateSecondaryMenuItem = (
    id: string,
    field: "text" | "href",
    value: string,
  ) => {
    setSecondaryMenu(
      secondaryMenu.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hrefLanguages: item.hrefLanguages.map((href) =>
              href.textHrefId === id &&
              href.language === teamSelected?.defaultLanguage
                ? { ...href, [field]: value }
                : href,
            ),
          };
        } else {
          return item;
        }
      }),
    );
  };

  const updateWelcome = (index: number, value: string) => {
    const updateWelcome = [...welText];
    updateWelcome[index] = value;
    setWelText(updateWelcome);
  };

  const deletePrimaryMenuItem = (id: string) => {
    setPrimaryMenu(primaryMenu.filter((item) => item.id !== id));
  };

  const deleteSecondaryMenuItem = (id: string) => {
    setSecondaryMenu(secondaryMenu.filter((item) => item.id !== id));
  };

  const deleteWelcome = (index: number) => {
    const newWel = welText.splice(index, 1);
    setWelText(newWel);
  };

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
      <CustomCard
        title={interfaceText.title}
        description={interfaceText.description}
      >
        <div className="space-y-2 mb-2">
          {teamSelected ? (
            <>
              <Label htmlFor="welcome-message-type">
                Tipus del welcome message
              </Label>
              <Select
                onValueChange={(value: WelcomeType) => {
                  setWelType(value);
                  setData({
                    ...data,
                    welcomeType: value,
                  });
                }}
              >
                <SelectTrigger className="w-[180px]" id="welcome-message-type">
                  <SelectValue placeholder={welType || "Selecciona un tipo"} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WelcomeType).map((i, index) => (
                    <SelectItem key={index} value={i as WelcomeType}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <SelectCharging />
          )}
        </div>
        <UploadImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.avatarUrl || teamSelected?.avatarUrl}?timestamp=${new Date().getTime()}`}
          description={interfaceText.avatar.uploadLogo}
          alt="avatar"
          recommendedSize={interfaceText.avatar.recommendedSize}
          fileUserImageType={FileUserImageType.AVATAR}
          accept=".png,.jpg,.jpeg"
          choose={interfaceText.avatar.choose}
          assistantId={assistantId as string}
        />
        {welType === WelcomeType.PLAIN && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {interfaceText.welcomeMessage.title}
            </Label>
            {teamSelected ? (
              <Textarea
                id="welcome-message"
                placeholder="Type your message here"
                className="min-h-[100px] w-full"
                value={welText[0] || ""}
                onChange={(e) => {
                  if (!teamSelected?.id) return;
                  setWelText([e.target.value]);
                  setData({
                    ...data,
                    welcome: welText
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
                              text: [e.target.value],
                            },
                          },
                        }
                      : {
                          create: {
                            text: [e.target.value],
                            description: "",
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
            <p className="text-sm text-muted-foreground">
              {interfaceText.welcomeMessage.description}
            </p>
          </div>
        )}

        {welType === WelcomeType.BUBBLE && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {interfaceText.welcomeMessage.linesTitle}
            </Label>
            <Reorder.Group
              axis="y"
              values={welText}
              onReorder={setWelText}
              className="space-y-2"
            >
              {welText.map((item, index) => (
                <Reorder.Item key={index} value={item}>
                  <motion.div
                    className="grid grid-cols-[auto__auto_1fr_auto] gap-2 items-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <GripVertical className="h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                    <p>
                      {interfaceText.welcomeMessage.line} {index + 1}
                    </p>
                    <Input
                      value={item}
                      onChange={(e) => {
                        updateWelcome(index, e.target.value);
                      }}
                      placeholder="Label name"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWelcome(index)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <Button variant="outline" size="sm" onClick={addWelcome}>
              {interfaceText.welcomeMessage.addLine}
            </Button>
            <p className="text-sm text-muted-foreground">
              {interfaceText.welcomeMessage.lineDescription}
            </p>
          </div>
        )}
      </CustomCard>
      <CustomCard
        title={interfaceText.menu.headerTitle}
        description={interfaceText.menu.headerDescription}
      >
        <div className="space-y-2 mb-2">
          <div>
            <h3 className="text-sm font-medium mb-2">
              {interfaceText.menu.menuHeaderTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {interfaceText.menu.menuHeaderTitleDescription}
            </p>
          </div>
          {teamSelected ? (
            <Reorder.Group
              axis="y"
              values={primaryMenu}
              onReorder={setPrimaryMenu}
              className="space-y-2 mb-2"
            >
              {primaryMenu.map((item) => {
                const values = item.hrefLanguages.find(
                  (item) =>
                    item.language === teamSelected?.defaultLanguage ||
                    LanguageType.ES,
                );
                return (
                  <Reorder.Item key={item.id} value={item}>
                    <motion.div
                      className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <Input
                        value={values?.text}
                        onChange={(e) =>
                          updatePrimaryMenuItem(item.id, "text", e.target.value)
                        }
                        placeholder="Label name"
                      />
                      <Input
                        value={values?.href}
                        onChange={(e) =>
                          updatePrimaryMenuItem(item.id, "href", e.target.value)
                        }
                        placeholder="https://acme.com"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePrimaryMenuItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          ) : (
            <TextAreaCharging />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={addPrimaryMenuItem}
            disabled={!teamSelected}
          >
            {interfaceText.menu.addItem}
          </Button>
        </div>

        <div className="space-y-4 ">
          <div>
            <h3 className="text-sm font-medium mb-2">
              {interfaceText.menu.menuBodyTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {interfaceText.menu.menuBodyDescription}
            </p>
          </div>
          {teamSelected ? (
            <Reorder.Group
              axis="y"
              values={secondaryMenu}
              onReorder={setSecondaryMenu}
              className="space-y-2"
            >
              {secondaryMenu.map((item) => {
                const values = item.hrefLanguages.find(
                  (item) =>
                    item.language === teamSelected?.defaultLanguage ||
                    LanguageType.ES,
                );
                return (
                  <Reorder.Item key={item.id} value={item}>
                    <motion.div
                      className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <Input
                        value={values?.text}
                        onChange={(e) =>
                          updateSecondaryMenuItem(
                            item.id,
                            "text",
                            e.target.value,
                          )
                        }
                        placeholder="Label name"
                      />
                      <Input
                        value={values?.href}
                        onChange={(e) =>
                          updateSecondaryMenuItem(
                            item.id,
                            "href",
                            e.target.value,
                          )
                        }
                        placeholder="https://acme.com"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSecondaryMenuItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          ) : (
            <TextAreaCharging />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={addSecondaryMenuItem}
            disabled={!teamSelected}
          >
            {interfaceText.menu.addItem}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="footer-header">
                {interfaceText.menu.menuFooterTitle}
              </Label>
              <div className="ml-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-1 text-sm font-medium text-white">
                Premium
              </div>
            </div>
            <Button variant="blue">
              {interfaceText.menu.menuFooterChangePlan}
            </Button>
          </div>

          {teamSelected ? (
            <Textarea
              id="footer-header"
              placeholder="Type your message here"
              className="min-h-[100px]"
              value={headerFoot || ""}
              onChange={(e) => {
                if (!teamSelected?.id) return;
                setHeaderFoot(e.target.value);
                setData({
                  ...data,
                  menuFooter: {
                    upsert: {
                      where: {
                        language_teamId: {
                          teamId: teamSelected.id,
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                        },
                      },
                      update: {
                        text: e.target.value,
                      },
                      create: {
                        text: e.target.value,
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          ) : (
            <TextAreaCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {interfaceText.menu.menuFooterDescription}
          </p>
        </div>
      </CustomCard>

      <CustomCard
        title={interfaceText.banner.title}
        description={interfaceText.banner.description}
      >
        <div className="space-y-2">
          <Label htmlFor="banner-button-text">
            {interfaceText.banner.buttonText}
          </Label>
          {teamSelected ? (
            <Input
              id="banner-button-text"
              placeholder="Texto en el botón"
              // className="min-h-[100px]"
              value={headerButton || ""}
              onChange={(e) => {
                if (!teamSelected?.id) return;
                setHeaderButton(e.target.value);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                          teamId: teamSelected.id,
                        },
                      },
                      update: {
                        buttonText: e.target.value,
                        title: headerButtonTitle,
                        text: headerButtonText,
                      },
                      create: {
                        buttonText: e.target.value,
                        title: headerButtonTitle,
                        type: HeaderButtonType.PLAIN,
                        text: headerButtonText,
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          ) : (
            <InputCharging />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-title">{interfaceText.banner.titleText}</Label>
          {teamSelected ? (
            <Input
              id="banner-title"
              value={headerButtonTitle || ""}
              onChange={(e) => {
                if (!teamSelected?.id) return;
                setHeaderButtonTitle(e.target.value);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                          teamId: teamSelected.id,
                        },
                      },
                      update: {
                        buttonText: headerButtonTitle,
                        title: e.target.value,
                        text: headerButtonText,
                      },
                      create: {
                        buttonText: headerButtonTitle,
                        title: e.target.value,
                        type: HeaderButtonType.PLAIN,
                        text: headerButtonText,
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          ) : (
            <InputCharging />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-text">{interfaceText.banner.text}</Label>
          {teamSelected ? (
            <Textarea
              id="banner-text"
              className="min-h-[100px]"
              value={(headerButtonText && headerButtonText[0]) || ""}
              onChange={(e) => {
                if (!teamSelected?.id) return;
                setHeaderButtonText([e.target.value]);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                          teamId: teamSelected.id,
                        },
                      },
                      update: {
                        buttonText: headerButtonTitle,
                        title: headerButtonTitle,
                        text: [e.target.value],
                      },
                      create: {
                        buttonText: headerButtonTitle,
                        title: headerButtonTitle,
                        type: HeaderButtonType.PLAIN,
                        text: [e.target.value],
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          ) : (
            <TextAreaCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {interfaceText.banner.textDescription}
          </p>
        </div>
      </CustomCard>

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
            <p className="text-sm text-muted-foreground">
              {interfaceText.footer.textDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
