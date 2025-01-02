"use client";

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
  AssistantCardType,
} from "@prisma/client";
import { useAppContext } from "@/components/context/appContext";
import { useEffect, useState } from "react";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import { MultiSelect } from "@/components/multi-select-language";
import { SelectCharging } from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export default function Component() {
  const { t } = useDashboardLanguage();
  const localisations = t("app.TEAM.TEAM_ID.SETTINGS.LOCALISATION.PAGE");

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
  const [menuFooter, setMenuFooter] = useState<string>("");

  const [showArea, setshowArea] = useState<string>("welcome");

  const [assValues, setAssValues] = useState<
    { title: string; language: LanguageType; description: string[] } | undefined
  >(undefined);

  useEffect(() => {
    if (teamSelected?.defaultLanguage) {
      setLanguageToTranslate(teamSelected?.defaultLanguage);
    }
  }, [teamSelected]);

  useEffect(() => {
    const welcome = teamSelected?.welcome?.find(
      (lang) => lang.language === languageToTranslate,
    )?.text;
    setWel(welcome ? welcome : []);
  }, [teamSelected, languageToTranslate]);

  useEffect(() => {
    const footer = teamSelected?.footer?.find(
      (lang) => lang.language === languageToTranslate,
    )?.text;
    setFooter(footer ? footer : "");
  }, [teamSelected]);

  useEffect(() => {
    const menuFooter = teamSelected?.menuFooter?.find(
      (lang) => lang.language === languageToTranslate,
    )?.text;
    setMenuFooter(menuFooter ? menuFooter : "");
  }, [teamSelected, languageToTranslate]);

  useEffect(() => {
    const menuHeaderDefaultLanguage =
      teamSelected?.menuHeader?.find((type) => type.type === "HEADER")
        ?.textHref || [];

    const menuBodyDefaultLanguage =
      teamSelected?.menuHeader?.find((type) => type.type === "BODY")
        ?.textHref || [];

    setMenuHeaderDefaultLanguage(menuHeaderDefaultLanguage);

    setMenuBodyDefaultLanguage(menuBodyDefaultLanguage);
  }, [teamSelected]);

  useEffect(() => {
    if (languageToTranslate) {
      const assByLang = teamSelected?.assistants
        .find((ass) => ass.url === showArea)
        ?.assistantCard?.find((lang) => lang.language === languageToTranslate);
      setAssValues(assByLang);
    }
  }, [teamSelected, languageToTranslate, showArea]);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full px-4 py-2 flex items-center justify-between gap-2 border mb-2 rounded-lg">
        <div className="flex grow items-center gap-2 flex-1">
          {teamSelected?.assistants ? (
            <Select
              onValueChange={(value) => {
                setshowArea(value);
              }}
              value={showArea}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">welcome</SelectItem>
                {teamSelected?.assistants.map((assistant, index) => {
                  return (
                    <SelectItem key={index} value={assistant.url}>
                      {assistant.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <SelectCharging />
          )}

          {languageToTranslate ? (
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
          ) : (
            <SelectCharging />
          )}
        </div>

        <div className="flex items-center ">
          <div className="max-w-[500px] mx-auto p-4 space-y-4">
            {teamSelected?.selectedLanguages &&
            teamSelected?.selectedLanguages ? (
              <MultiSelect
                options={Object.values(LanguageType).map((i) => ({
                  value: i,
                  label: i.toLowerCase(),
                }))}
                placeholder={localisations.activeLanguage}
                onChange={(values) => {
                  setData({
                    ...data,
                    selectedLanguages: {
                      set: values as LanguageType[],
                    },
                  });
                }}
                selectedDefault={teamSelected?.selectedLanguages}
                defaultLanguages={teamSelected?.defaultLanguage}
              />
            ) : (
              <SelectCharging />
            )}
          </div>
        </div>
      </div>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50%]">{`Default (${teamSelected?.defaultLanguage || ""})`}</TableHead>
              <TableHead className="w-[50%]">
                {teamSelected?.defaultLanguage === languageToTranslate
                  ? localisations.changeText
                  : `${localisations.translation} (${languageToTranslate || ""})`}
              </TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>

          {showArea === "welcome" && teamSelected && (
            <TableBody>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">
                  {localisations.welcomeScreen}
                </TableCell>
              </TableRow>

              {languageToTranslate &&
                teamSelected?.welcome
                  .find(
                    (lang) => lang.language === teamSelected?.defaultLanguage,
                  )
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
                      {/* <TableCell className="text-right"></TableCell> */}
                    </TableRow>
                  ))}

              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">
                  {localisations.footer}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  {
                    teamSelected?.footer?.find(
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
                  {localisations.headerHeader}
                </TableCell>
              </TableRow>

              {menuHeaderDefaultLanguage?.map((textHref, index) => {
                const defaultText =
                  textHref.hrefLanguages?.find(
                    (lan) => lan.language === teamSelected?.defaultLanguage,
                  )?.text || "";
                const language =
                  textHref.hrefLanguages?.find(
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
                  {localisations.headerBody}
                </TableCell>
              </TableRow>

              {menuBodyDefaultLanguage?.map((textHref, index) => {
                const defaultText =
                  textHref.hrefLanguages?.find(
                    (lan) => lan.language === teamSelected?.defaultLanguage,
                  )?.text || "";
                const language =
                  textHref.hrefLanguages?.find(
                    (lan) => lan.language === languageToTranslate,
                  )?.text || "";

                return (
                  <TableRow key={index}>
                    <TableCell>{defaultText}</TableCell>
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

              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">
                  {localisations.headerFooter}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  {
                    teamSelected?.menuFooter?.find(
                      (lang) => lang.language === teamSelected?.defaultLanguage,
                    )?.text
                  }
                </TableCell>
                {languageToTranslate && teamSelected && (
                  <TableCell>
                    <Input
                      value={menuFooter}
                      onChange={(e) => {
                        setMenuFooter(e.target.value);
                        setData({
                          ...data,
                          menuFooter: {
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
            </TableBody>
          )}
          {teamSelected?.assistants
            ?.find((ass) => ass.url === showArea)
            ?.assistantCard?.filter(
              (ass) => ass.language === teamSelected?.defaultLanguage,
            )
            .map((ass, index) => {
              return (
                <TableBody key={index}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-medium">
                      {localisations.assistantTitle}: {ass.title}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{ass.title}</TableCell>
                    <TableCell>
                      {/* {assValues?.title} */}
                      <Input
                        id="title-message"
                        placeholder="Escribe tu título"
                        value={assValues?.title || ""}
                        onChange={(e) => {
                          setAssValues({
                            title: e.target.value,
                            description: assValues?.description || [""],
                            language: languageToTranslate || LanguageType.ES,
                          });
                          setData({
                            ...data,
                            assistants: {
                              update: {
                                where: {
                                  url_teamId: {
                                    url: showArea,
                                    teamId: teamSelected?.id,
                                  },
                                },
                                data: {
                                  assistantCard: {
                                    upsert: {
                                      where: {
                                        language_assistantId: {
                                          language:
                                            languageToTranslate ||
                                            LanguageType.ES,
                                          assistantId:
                                            teamSelected?.assistants?.find(
                                              (ass) => ass.url === showArea,
                                            )?.id || "",
                                        },
                                      },
                                      create: {
                                        title: e.target.value,
                                        description: assValues?.description || [
                                          "",
                                        ],
                                        language:
                                          languageToTranslate ||
                                          LanguageType.ES,
                                        type: AssistantCardType.REGULAR,
                                      },
                                      update: {
                                        title: e.target.value,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{ass.description[0]}</TableCell>
                    <TableCell>
                      {/* {assValues?.title} */}
                      <Input
                        id="title-message"
                        placeholder="Escribe tu título"
                        value={assValues?.description[0] || ""}
                        onChange={(e) => {
                          setAssValues({
                            title: assValues?.title || "",
                            description: [e.target.value],
                            language: languageToTranslate || LanguageType.ES,
                          });
                          setData({
                            ...data,
                            assistants: {
                              update: {
                                where: {
                                  url_teamId: {
                                    url: showArea,
                                    teamId: teamSelected?.id,
                                  },
                                },
                                data: {
                                  assistantCard: {
                                    upsert: {
                                      where: {
                                        language_assistantId: {
                                          language:
                                            languageToTranslate ||
                                            LanguageType.ES,
                                          assistantId:
                                            teamSelected?.assistants?.find(
                                              (ass) => ass.url === showArea,
                                            )?.id || "",
                                        },
                                      },
                                      create: {
                                        title: assValues?.title || "",
                                        description: [e.target.value],
                                        language:
                                          languageToTranslate ||
                                          LanguageType.ES,
                                        type: AssistantCardType.REGULAR,
                                      },
                                      update: {
                                        description: [e.target.value],
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          {!teamSelected && (
            <TableBody className="w-full h-[300px]"></TableBody>
          )}
        </Table>
      </div>
    </div>
  );
}
