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
  Footer,
  LanguageType,
  MenuHeaderType,
  Prisma,
  TextHref,
  Welcome,
  WelcomeType,
  MenuFooter,
  HeaderButtonType,
} from "@prisma/client";
import { Ellipsis, Eye, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reorder, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseFile } from "@/components/context/useAppContext/file";
import Image from "next/image";
import { FileUserImageType } from "@/types/types";

export default function Interface() {
  const {
    state: { user, teamSelected },
  } = useAppContext();

  const [foot, setFoot] = useState<string>();
  const [headerFoot, setHeaderFoot] = useState<string>();
  const [headerButton, setHeaderButton] = useState<string>("");
  const [headerButtonTitle, setHeaderButtonTitle] = useState<string>("");
  const [headerButtonText, setHeaderButtonText] = useState<string[]>([""]);
  const [welText, setWelText] = useState<string[]>([""]);
  const [welType, setWelType] = useState<WelcomeType>(WelcomeType.PLAIN);
  const [welAvatarUrl, setWelAvatarUrl] = useState<string>("");

  const { uploadSupaseFile } = useSupabaseFile();

  const fileInputLogoRef = useRef<HTMLInputElement | null>(null);

  const handleLogoClick = () => {
    fileInputLogoRef.current?.click();
  };

  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    setFoot(
      teamSelected?.footer?.find(
        (foot: Footer) => foot.language === teamSelected?.defaultLanguage,
      )?.text,
    );

    const welcome = teamSelected?.welcome?.find(
      (wel: Welcome) => wel.language === teamSelected?.defaultLanguage,
    );

    setWelText(welcome?.text || [""]);
    setWelType(teamSelected?.welcomeType || WelcomeType.PLAIN);
    setWelAvatarUrl(teamSelected?.avatarUrl || "");
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
        (menu: any) => menu.type === MenuHeaderType.HEADER,
      )?.textHref || [],
    );
    setSecondaryMenu(
      teamSelected?.menuHeader?.find(
        (menu: any) => menu.type === MenuHeaderType.BODY,
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
        language: teamSelected?.defaultLanguage || LanguageType.ES,
        defaultTextHrefId: null,
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
        language: teamSelected?.defaultLanguage || LanguageType.ES,
        defaultTextHrefId: null,
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
    welText.splice(index, 1);
  };

  const menuHandler = (
    menuItem: TextHref[],
    menuHeaderType: MenuHeaderType,
  ) => {
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
                  language: teamSelected?.defaultLanguage || LanguageType.ES,
                },
                update: {
                  text: item.text,
                  href: item.href,
                  numberOrder:
                    menuItem.findIndex((el) => el.id === item.id) + 1,
                  language: teamSelected?.defaultLanguage || LanguageType.ES,
                },
              })),
            },
          },
          create: {
            type: menuHeaderType,
            textHref: {
              create: menuItem.map((item) => ({
                text: item.text,
                href: item.href,
                numberOrder: menuItem.findIndex((el) => el.id === item.id) + 1,
                language: teamSelected?.defaultLanguage || LanguageType.ES,
              })),
            },
          },
        },
      },
    };

    return updatedData;
  };

  const welcomeHandler = () => {
    const updatedData: Prisma.TeamUpdateInput = {
      ...data,
      welcome: {
        upsert: {
          where: {
            language_teamId: {
              language: teamSelected?.language || LanguageType.ES, // O el tipo que corresponda
              teamId: teamSelected?.id,
            },
          },
          update: {
            text: welText,
          },
          create: {
            text: welText,
            language: teamSelected?.language || LanguageType.ES,
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
    <div className="max-w-2xl mx-auto p-4 space-y-8 ">
      <Card>
        <CardHeader>
          <CardTitle>Welcome message</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
                <SelectValue placeholder={welType} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(WelcomeType).map((i, index) => (
                  <SelectItem key={index} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Upload Avatar</Label>
            <div className="flex items-center space-x-2">
              {avatarLoading ? (
                <Ellipsis className="h-8 w-8 animate-pulse text-slate-400" />
              ) : (typeof data?.avatarUrl === "string" && data?.avatarUrl) ||
                teamSelected?.avatarUrl ? (
                <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${welAvatarUrl}?timestamp=${new Date().getTime()}`}
                    alt="avatar"
                    width={30}
                    height={30}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 border rounded-full  flex items-center justify-center bg-muted">
                  CN
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogoClick}>
                Choose
                <input
                  ref={fileInputLogoRef}
                  type="file"
                  className="hidden"
                  // multiple
                  accept=".png,.jpg,.jpeg"
                  onChange={async (e) => {
                    setAvatarLoading(true);
                    if (e.target.files && teamSelected?.id) {
                      const url = await uploadSupaseFile({
                        fileInput: e.target.files as unknown as FileList,
                        userId: user.user.id,
                        teamId: teamSelected.id as string,
                        fileUserImageType: FileUserImageType.AVATAR,
                      });
                      setWelAvatarUrl(url.data);
                      setData({ ...data, avatarUrl: url.data });
                    }
                    setAvatarLoading(false);
                  }}
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size 180 × 180
            </p>
          </div>
          {welType === WelcomeType.PLAIN && (
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Your message</Label>
              <Textarea
                id="welcome-message"
                placeholder="Type your message here"
                className="min-h-[100px]"
                value={welText[0] || ""}
                onChange={(e) => {
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
                                  teamSelected?.language || LanguageType.ES,
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
                            language: teamSelected?.language || LanguageType.ES,
                          },
                        },
                  });
                }}
              />
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
          )}

          {welType === WelcomeType.BUBBLE && (
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Lineas del welcome</Label>
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
                      <p>Línea {index + 1}</p>
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
                Add item
              </Button>
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
          )}

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="footer-header">Footer header</Label>
                <div className="ml-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-1 text-sm font-medium text-white">
                  Premium
                </div>
              </div>
              <Button variant="blue">Change plan</Button>
            </div>

            <Textarea
              id="footer-header"
              placeholder="Type your message here"
              className="min-h-[100px]"
              value={headerFoot || ""}
              onChange={(e) => {
                setHeaderFoot(e.target.value);
                setData({
                  ...data,
                  menuFooter: {
                    upsert: {
                      where: {
                        language_teamId: {
                          teamId: teamSelected.id,
                          language: teamSelected?.language || LanguageType.ES,
                        },
                      },
                      update: {
                        text: e.target.value,
                      },
                      create: {
                        text: e.target.value,
                        language: teamSelected?.language || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>
          </div>
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner de información</CardTitle>
          <CardDescription>
            Disclaimer information situado en el menú
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-button-text">Títol botó</Label>
            <Input
              id="banner-button-text"
              placeholder="Texto en el botón"
              // className="min-h-[100px]"
              value={headerButton || ""}
              onChange={(e) => {
                setHeaderButton(e.target.value);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language: teamSelected?.language || LanguageType.ES,
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
                        language: teamSelected?.language || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-title">Títol</Label>
            <Input
              id="banner-title"
              placeholder="Títol al banner"
              // className="min-h-[100px]"
              value={headerButtonTitle || ""}
              onChange={(e) => {
                setHeaderButtonTitle(e.target.value);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language: teamSelected?.language || LanguageType.ES,
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
                        language: teamSelected?.language || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-text">Text del banner</Label>
            <Textarea
              id="banner-text"
              placeholder="texte del banner"
              className="min-h-[100px]"
              value={(headerButtonText && headerButtonText[0]) || ""}
              onChange={(e) => {
                setHeaderButtonText([e.target.value]);
                setData({
                  ...data,
                  headerButton: {
                    upsert: {
                      where: {
                        language_teamId: {
                          language: teamSelected?.language || LanguageType.ES,
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
                        language: teamSelected?.language || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="footer-message">Your message</Label>
            <Textarea
              id="footer-message"
              placeholder="Type your message here"
              className="min-h-[100px]"
              value={foot || ""}
              onChange={(e) => {
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
                                teamSelected?.language || LanguageType.ES,
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
                          language: teamSelected?.language || LanguageType.ES,
                        },
                      },
                });
              }}
            />
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
