import { LanguageType, Prisma } from "@prisma/client";
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
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
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
    menuHeader: {
      select: {
        type: true;
        textHref: {
          select: {
            text: true;
            href: true;
            numberOrder: true;
          };
        };
      };
    };
    menuFooter: true;
    customDomain: true;
    assistants: {
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
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
    select: {
      selectedLanguages: true,
    },
  });

  if (!languageInclude?.selectedLanguages.includes(language)) {
    return null;
  }

  const team = await prisma.team.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
    select: {
      welcomeType: true,
      name: true,
      logoUrl: true,
      symbolUrl: true,
      avatarUrl: true,
      footer: {
        where: {
          language: language, // Filtra por el idioma específico
        },
        select: {
          text: true,
        },
      },
      welcome: {
        where: {
          language: language,
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
            where: {
              language: language, // Filtra por el idioma específico
            },
            select: {
              text: true,
              href: true,
              numberOrder: true,
            },
          },
        },
      },
      menuFooter: true,
      customDomain: true,
      assistants: {
        select: {
          id: true,
          name: true,
          emoji: true,
          url: true,
          assistantCard: {
            where: {
              language: language,
            },
            select: {
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  return team;
}
