import {
  AssitantStatus,
  EntryPointsType,
  LanguageType,
  Prisma,
} from "@prisma/client";
import prisma from "../prisma";

export async function getTeamDataByDomainOrCustomDomainMetadata(
  domain: string,
) {
  const rootDomain = `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  const team = await prisma.team.findFirst({
    where: subdomain
      ? { subDomain: subdomain, isActive: true } // If subdomain is true, filter by subdomain
      : { customDomain: domain, isActive: true }, // Otherwise, filter by customDomain
    select: {
      name: true,
      logoUrl: true,
      symbolUrl: true,
      // customDomain: true,
    },
  });

  return team;
}

export type GetTeamDataByDomainOrCustomDomainPage = Prisma.TeamGetPayload<{
  select: {
    id: true;
    welcomeType: true;
    name: true;
    logoUrl: true;
    symbolUrl: true;
    avatarUrl: true;
    footer: {
      select: {
        text: true;
      };
    };
    welcome: {
      select: {
        text: true;
        description: true;
      };
    };
    headerButton: true;
    menuHeader: {
      select: {
        type: true;
        textHref: {
          select: {
            text: true;
            href: true;
            numberOrder: true;
            hrefLanguages: true;
          };
        };
      };
    };
    menuFooter: true;
    customDomain: true;
    paddleSubscriptionId: true;
    assistants: {
      where: {
        isActive: true;
      };
      select: {
        id: true;
        name: true;
        emoji: true;
        url: true;
        assistantCard: {
          select: {
            title: true;
            description: true;
          };
        };
        entryPoints: {
          select: {
            entryPoint: {
              select: {
                entryPointLanguages: {
                  select: {
                    language: true;
                    text: true;
                    question: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}> | null;

export async function getTeamDataByDomainOrCustomDomainPage({
  domain,
  language,
}: {
  domain: string;
  language: LanguageType;
}): Promise<GetTeamDataByDomainOrCustomDomainPage> {
  const rootDomain = `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  const languageInclude = await prisma.team.findFirst({
    where: subdomain
      ? { subDomain: subdomain, isActive: true } // If subdomain is true, filter by subdomain
      : { customDomain: domain, isActive: true }, // Otherwise, filter by customDomain
    select: {
      selectedLanguages: true,
    },
  });

  if (!languageInclude?.selectedLanguages.includes(language)) {
    return null;
  }

  const team = await prisma.team.findFirst({
    where: subdomain
      ? { subDomain: subdomain, isActive: true } // If subdomain is true, filter by subdomain
      : { customDomain: domain, isActive: true }, // Otherwise, filter by customDomain
    select: {
      id: true,
      welcomeType: true,
      name: true,
      logoUrl: true,
      symbolUrl: true,
      avatarUrl: true,
      footer: {
        where: {
          language, // Filtra por el idioma específico
        },
        select: {
          text: true,
        },
      },
      welcome: {
        where: {
          language,
        },
        select: {
          text: true,
          description: true,
        },
      },
      menuHeader: {
        select: {
          type: true,
          textHref: {
            select: {
              numberOrder: true,
              hrefLanguages: {
                where: {
                  language,
                },
              },
            },
          },
        },
      },
      headerButton: true,
      menuFooter: {
        where: {
          language,
        },
      },
      customDomain: true,
      paddleSubscriptionId: true,
      assistants: {
        where: {
          isActive: true,
          status: AssitantStatus.PUBLIC,
        },
        select: {
          id: true,
          name: true,
          emoji: true,
          url: true,
          assistantCard: {
            where: {
              language,
            },
            select: {
              title: true,
              description: true,
            },
          },
          entryPoints: {
            where: {
              type: EntryPointsType.REGULAR,
            },
            select: {
              entryPoint: {
                select: {
                  entryPointLanguages: {
                    where: {
                      language,
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

  return team;
}

export enum Empty {
  EMPTY = "EMPTY",
}

export async function getLangValidByDomainOrCustomDomainPage({
  domain,
  language,
}: {
  domain: string;
  language: LanguageType | Empty;
}) {
  const rootDomain = `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  const languageInclude = await prisma.team.findFirst({
    where: subdomain
      ? { subDomain: subdomain, isActive: true } // If subdomain is true, filter by subdomain
      : { customDomain: domain, isActive: true }, // Otherwise, filter by customDomain
    select: {
      selectedLanguages: true,
      defaultLanguage: true,
    },
  });

  if (!languageInclude) return null;

  if (language === Empty.EMPTY) {
    return languageInclude.defaultLanguage;
  }

  // manipulateLanguage = language && languageInclude?.selectedLanguages.includes(language) ?

  if (languageInclude.selectedLanguages.includes(language)) {
    return language;
  }

  // console.log('holaa',{languageInclude})

  // if (!languageInclude) {
  //   return null;
  // }

  return null;
}
