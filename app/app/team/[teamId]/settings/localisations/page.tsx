"use client";

import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  LanguageType,
  MenuHeaderType,
  TextHref,
  HrefLanguages,
} from "@prisma/client";
import { useAppContext } from "@/components/context/appContext";
import { useEffect, useState } from "react";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";

interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export default function Component() {
  const {
    state: { teamSelected },
  } = useAppContext();
  const { data, setData } = useTeamSettingsContext();

  const [languageToTranslate, setLanguageToTranslate] =
    useState<null | LanguageType>(null);

  const [wel, setWel] = useState<string[]>([]);
  const [footer, setFooter] = useState<string>("");
  const [menuHeaderValue, setMenuHeaderValue] = useState<string[]>([]);
  const [menuBodyValue, setMenuBodyValue] = useState<string[]>([]);
  const [menuHeaderDefaultLanguage, setMenuHeaderDefaultLanguage] = useState<
    ExtendedTextHref[]
  >([]);
  const [menuBodyDefaultLanguage, setMenuBodyDefaultLanguage] = useState<
    ExtendedTextHref[]
  >([]);

  useEffect(() => {
    if (teamSelected?.defaultLanguage) {
      setLanguageToTranslate(teamSelected?.defaultLanguage);
    }
  }, [teamSelected]);

  useEffect(() => {
    const welcome = teamSelected?.welcome.find(
      (lang) => lang.language === languageToTranslate,
    )?.text;
    setWel(welcome ? welcome : []);
  }, [teamSelected, languageToTranslate]);

  useEffect(() => {
    const footer = teamSelected?.footer.find(
      (lang) => lang.language === languageToTranslate,
    )?.text;
    setFooter(footer ? footer : "");
  }, [teamSelected, languageToTranslate]);

  useEffect(() => {
    const menuHeaderDefaultLanguage =
      teamSelected?.menuHeader.find((type) => type.type === "HEADER")
        ?.textHref || [];

    const menuBodyDefaultLanguage =
      teamSelected?.menuHeader.find((type) => type.type === "BODY")?.textHref ||
      [];

    setMenuHeaderDefaultLanguage(menuHeaderDefaultLanguage);

    setMenuBodyDefaultLanguage(menuBodyDefaultLanguage);
  }, [teamSelected]);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full px-4 py-2 flex items-center justify-between gap-2 border mb-2 rounded-lg">
        <div className="flex grow items-center gap-2 flex-1">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Team</SelectItem>
              <SelectItem value="low">Assistants cards</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setLanguageToTranslate(value as LanguageType)
            }
            value={languageToTranslate ? languageToTranslate : undefined}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LanguageType).map((i, index) => (
                <SelectItem key={index} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center ">
          <Button size="sm" className="">
            <WandSparkles className="w-4 h-4 mr-1" />
            Auto Translate
          </Button>
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50%]">{`Default (${teamSelected?.defaultLanguage})`}</TableHead>
              <TableHead className="w-[50%]">
                Traduint{`(${languageToTranslate})`}
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Welcome screen
              </TableCell>
            </TableRow>

            {languageToTranslate &&
              teamSelected?.welcome
                .find((lang) => lang.language === teamSelected?.defaultLanguage)
                ?.text.map((text, index) => (
                  <TableRow key={index}>
                    <TableCell>{text}</TableCell>
                    <TableCell>
                      {/* <EditableCell value={text} rowId={item.id} field="text" /> */}
                      <Input
                        value={wel && wel[index] ? wel[index] : ""}
                        onChange={(e) => {
                          const updateWel = [...wel];
                          updateWel[index] = e.target.value;
                          setWel(updateWel);
                          setData({
                            ...data,
                            welcome: {
                              upsert: {
                                where: {
                                  language_teamId: {
                                    language:
                                      languageToTranslate ||
                                      teamSelected?.defaultLanguage ||
                                      LanguageType.ES, // O el tipo que corresponda
                                    teamId: teamSelected?.id,
                                  },
                                },
                                update: {
                                  text: updateWel,
                                },
                                create: {
                                  text: updateWel,
                                  language:
                                    languageToTranslate ||
                                    teamSelected?.defaultLanguage ||
                                    LanguageType.ES,
                                  description: "",
                                },
                              },
                            },
                          });
                        }}
                        placeholder="Label name"
                      />
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ))}

            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Footer
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                {
                  teamSelected?.footer.find(
                    (lang) => lang.language === teamSelected?.defaultLanguage,
                  )?.text
                }
              </TableCell>
              {languageToTranslate && teamSelected && (
                <TableCell>
                  <Input
                    value={footer}
                    onChange={(e) => {
                      setFooter(e.target.value);
                      setData({
                        ...data,
                        footer: {
                          upsert: {
                            where: {
                              language_teamId: {
                                language:
                                  languageToTranslate ||
                                  teamSelected?.defaultLanguage ||
                                  LanguageType.ES, // O el tipo que corresponda
                                teamId: teamSelected?.id,
                              },
                            },
                            update: {
                              text: e.target.value,
                            },
                            create: {
                              text: e.target.value,
                              language:
                                languageToTranslate ||
                                teamSelected?.defaultLanguage ||
                                LanguageType.ES,
                            },
                          },
                        },
                      });
                    }}
                    placeholder="Label name"
                  />
                </TableCell>
              )}
              <TableCell className="text-right"></TableCell>
            </TableRow>

            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Header
              </TableCell>
            </TableRow>

            {menuHeaderDefaultLanguage?.map((textHref, index) => {
              const defaultText =
                textHref.hrefLanguages.find(
                  (lan) => lan.language === teamSelected?.defaultLanguage,
                )?.text || "";
              const language =
                textHref.hrefLanguages.find(
                  (lan) => lan.language === languageToTranslate,
                )?.text || "";

              return (
                <TableRow key={index}>
                  <TableCell>{defaultText}</TableCell>
                  {/* {JSON.stringify(textHref)} */}

                  <TableCell>
                    <Input
                      value={menuHeaderValue[index] || language}
                      onChange={(e) => {
                        const updateMenuHeader = [...menuHeaderValue];
                        updateMenuHeader[index] = e.target.value;
                        setMenuHeaderValue(updateMenuHeader);
                        if (teamSelected?.id && languageToTranslate) {
                          setData({
                            ...data,
                            menuHeader: {
                              update: {
                                where: {
                                  type_teamId: {
                                    type: MenuHeaderType.HEADER, // Tipo del menú
                                    teamId: teamSelected?.id,
                                  },
                                },
                                data: {
                                  textHref: {
                                    update: {
                                      where: {
                                        id: textHref.id,
                                      },
                                      data: {
                                        hrefLanguages: {
                                          upsert: {
                                            where: {
                                              textHrefId_language: {
                                                textHrefId: textHref.id,
                                                language:
                                                  languageToTranslate ||
                                                  teamSelected?.defaultLanguage ||
                                                  LanguageType.ES, // O el tipo que corresponda
                                              },
                                            },
                                            update: {
                                              text: updateMenuHeader[index],
                                            },
                                            create: {
                                              text: updateMenuHeader[index],
                                              href: defaultText,
                                              language:
                                                languageToTranslate ||
                                                teamSelected?.defaultLanguage ||
                                                LanguageType.ES,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          });
                        }
                      }}
                      placeholder="Label name"
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Header Body
              </TableCell>
            </TableRow>

            {menuBodyDefaultLanguage?.map((textHref, index) => {
              const defaultText =
                textHref.hrefLanguages.find(
                  (lan) => lan.language === teamSelected?.defaultLanguage,
                )?.text || "";
              const language =
                textHref.hrefLanguages.find(
                  (lan) => lan.language === languageToTranslate,
                )?.text || "";

              return (
                <TableRow key={index}>
                  <TableCell>{defaultText}</TableCell>
                  {/* {JSON.stringify(textHref)} */}

                  <TableCell>
                    <Input
                      value={menuBodyValue[index] || language}
                      onChange={(e) => {
                        const updateMenuHeader = [...menuBodyValue];
                        updateMenuHeader[index] = e.target.value;
                        setMenuBodyValue(updateMenuHeader);
                        if (teamSelected?.id && languageToTranslate) {
                          setData({
                            ...data,
                            menuHeader: {
                              update: {
                                where: {
                                  type_teamId: {
                                    type: MenuHeaderType.BODY, // Tipo del menú
                                    teamId: teamSelected?.id,
                                  },
                                },
                                data: {
                                  textHref: {
                                    update: {
                                      where: {
                                        id: textHref.id,
                                      },
                                      data: {
                                        hrefLanguages: {
                                          upsert: {
                                            where: {
                                              textHrefId_language: {
                                                textHrefId: textHref.id,
                                                language:
                                                  languageToTranslate ||
                                                  teamSelected?.defaultLanguage ||
                                                  LanguageType.ES, // O el tipo que corresponda
                                              },
                                            },
                                            update: {
                                              text: updateMenuHeader[index],
                                            },
                                            create: {
                                              text: updateMenuHeader[index],
                                              href: defaultText,
                                              language:
                                                languageToTranslate ||
                                                teamSelected?.defaultLanguage ||
                                                LanguageType.ES,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          });
                        }
                      }}
                      placeholder="Label name"
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {/* {teamSelected?.menuHeader.find(type=> type.type === 'BODY')?.textHref?.map((textHref, index) => (<TableRow key={index}>
              <TableCell>
                {textHref.text}
              </TableCell>
              <TableCell>
                Genero respostes amb intel·ligència artificial i puc cometre
                errors.
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  New
                </Badge>
              </TableCell>
            </TableRow>))} */}

            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Footer screen
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                {
                  teamSelected?.menuFooter.find(
                    (lang) => lang.language === teamSelected?.defaultLanguage,
                  )?.text
                }
              </TableCell>
              <TableCell>Salutacions!</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
