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
  FooterType,
  LanguageType,
  MenuHeaderType,
  Prisma,
  TextHref,
  Welcome,
  WelcomeType,
} from "@prisma/client";
import { Eye, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Reorder, motion } from "framer-motion";

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  console.log({ teamSelected: teamSelected });

  useEffect(() => {
    setPrimaryMenu(
      teamSelected?.menuHeader?.find(
        (menu: any) =>
          menu.language === LanguageType.ES &&
          menu.type === MenuHeaderType.HEADER,
      )?.textHref || [],
    );
    setSecondaryMenu(
      teamSelected?.menuHeader?.find(
        (menu: any) =>
          menu.language === LanguageType.ES &&
          menu.type === MenuHeaderType.BODY,
      )?.textHref || [],
    );
  }, [teamSelected?.menuHeader]);

  const { data, setData } = useTeamSettingsContext();

  // Estado para los menús
  const [primaryMenu, setPrimaryMenu] = useState<TextHref[]>([]);

  const [secondaryMenu, setSecondaryMenu] = useState<TextHref[]>([]);

  const addPrimaryMenuItem = () => {
    setPrimaryMenu([
      ...primaryMenu,
      {
        id: Date.now().toString(),
        text: "",
        href: "",
        numberOrder: 0,
        menuHeaderId: null,
        headerButtonId: null,
      },
    ]);
  };

  const addSecondaryMenuItem = () => {
    setSecondaryMenu([
      ...secondaryMenu,
      {
        id: Date.now().toString(),
        text: "",
        href: "",
        numberOrder: 0,
        menuHeaderId: null,
        headerButtonId: null,
      },
    ]);
  };

  const updatePrimaryMenuItem = (
    id: string,
    field: "text" | "href",
    value: string,
  ) => {
    setPrimaryMenu(
      primaryMenu.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateSecondaryMenuItem = (
    id: string,
    field: "text" | "href",
    value: string,
  ) => {
    setSecondaryMenu(
      secondaryMenu.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const deletePrimaryMenuItem = (id: string) => {
    setPrimaryMenu(primaryMenu.filter((item) => item.id !== id));
  };

  const deleteSecondaryMenuItem = (id: string) => {
    setSecondaryMenu(secondaryMenu.filter((item) => item.id !== id));
  };

  const menuHandler = (
    menuItem: TextHref[],
    menuHeaderType: MenuHeaderType,
    language: LanguageType,
  ) => {
    const updatedData: Prisma.TeamUpdateInput = {
      ...data,
      menuHeader: {
        upsert: {
          where: {
            type_language_teamId: {
              type: menuHeaderType, // O el tipo que corresponda
              language, // Asegúrate de definir el idioma correcto
              teamId: teamSelected?.id,
            },
          },
          update: {
            textHref: {
              deleteMany: {
                id: {
                  notIn: menuItem.map((item) => item.id),
                },
              },
              upsert: menuItem.map((item) => ({
                where: { id: item.id },
                create: {
                  text: item.text,
                  href: item.href,
                  numberOrder:
                    menuItem.findIndex((el) => el.id === item.id) + 1,
                },
                update: {
                  text: item.text,
                  href: item.href,
                  numberOrder:
                    menuItem.findIndex((el) => el.id === item.id) + 1,
                },
              })),
            },
          },
          create: {
            type: menuHeaderType, // Cambia este valor según corresponda
            language, // Asegúrate de definir el idioma correcto
            textHref: {
              create: menuItem.map((item) => ({
                text: item.text,
                href: item.href,
                numberOrder: menuItem.findIndex((el) => el.id === item.id) + 1,
              })),
            },
          },
        },
      },
    };

    return updatedData;
  };

  useEffect(() => {
    const updatedData = menuHandler(
      primaryMenu,
      MenuHeaderType.HEADER,
      LanguageType.ES,
    );

    setData(updatedData);
  }, [primaryMenu]);

  useEffect(() => {
    const updatedData = menuHandler(
      secondaryMenu,
      MenuHeaderType.BODY,
      LanguageType.ES,
    );

    setData(updatedData);
  }, [secondaryMenu]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 ">
      <Card>
        <CardHeader>
          <CardTitle>Welcome message</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamSelected?.welcome?.map((wel: Welcome, index: number) => (
            <div className="space-y-2" key={index}>
              <Label htmlFor="welcome-message">Your message</Label>
              <Textarea
                id="welcome-message"
                placeholder="Type your message here"
                className="min-h-[100px]"
                value={
                  (!Array.isArray(data?.welcome?.update) &&
                    Array.isArray(data?.welcome?.update?.data?.text) &&
                    data?.welcome?.update?.data?.text[0]) ||
                  (!Array.isArray(data.welcome?.create) &&
                    Array.isArray(data.welcome?.create?.text) &&
                    data.welcome?.create?.text[0]) ||
                  wel?.text[0] ||
                  ""
                }
                onChange={(e) => {
                  setData({
                    ...data,
                    welcome: wel
                      ? {
                          update: {
                            where: {
                              language_teamId: {
                                teamId: teamSelected.id,
                                language: LanguageType.ES,
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
                            type: WelcomeType.PLAIN,
                            description: "",
                            language: LanguageType.ES,
                          },
                        },
                  });
                }}
              />
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
          ))}
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Primary menu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website or blog.
              </p>
            </div>
            <Reorder.Group
              axis="y"
              values={primaryMenu}
              onReorder={setPrimaryMenu}
              className="space-y-2"
            >
              {primaryMenu.map((item) => (
                <Reorder.Item key={item.id} value={item}>
                  <motion.div
                    className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        updatePrimaryMenuItem(item.id, "text", e.target.value)
                      }
                      placeholder="Label name"
                    />
                    <Input
                      value={item.href}
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
              ))}
            </Reorder.Group>
            <Button variant="outline" size="sm" onClick={addPrimaryMenuItem}>
              Add item
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Secondary menu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website or blog.
              </p>
            </div>
            <Reorder.Group
              axis="y"
              values={secondaryMenu}
              onReorder={setSecondaryMenu}
              className="space-y-2"
            >
              {secondaryMenu.map((item) => (
                <Reorder.Item key={item.id} value={item}>
                  <motion.div
                    className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                    <Input
                      value={item.text}
                      onChange={(e) =>
                        updateSecondaryMenuItem(item.id, "text", e.target.value)
                      }
                      placeholder="Label name"
                    />
                    <Input
                      value={item.href}
                      onChange={(e) =>
                        updateSecondaryMenuItem(item.id, "href", e.target.value)
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
              ))}
            </Reorder.Group>
            <Button variant="outline" size="sm" onClick={addSecondaryMenuItem}>
              Add item
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer message</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamSelected?.footer?.map((foot: any, index: number) => (
            <div className="space-y-2" key={index}>
              <Label htmlFor="footer-message">Your message</Label>
              <Textarea
                id="footer-message"
                placeholder="Type your message here"
                className="min-h-[100px]"
                value={
                  (!Array.isArray(data?.footer?.update) &&
                    Array.isArray(data?.footer?.update?.data?.text) &&
                    data?.footer?.update?.data?.text) ||
                  (!Array.isArray(data.footer?.create) &&
                    Array.isArray(data.footer?.create?.text) &&
                    data.footer?.create?.text) ||
                  foot?.text[0] ||
                  ""
                }
                onChange={(e) => {
                  setData({
                    ...data,
                    footer: foot
                      ? {
                          update: {
                            where: {
                              language_teamId: {
                                teamId: teamSelected.id,
                                language: LanguageType.ES,
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
                            type: FooterType.PLAIN,
                            language: LanguageType.ES,
                          },
                        },
                  });
                }}
              />
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
          ))}
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
