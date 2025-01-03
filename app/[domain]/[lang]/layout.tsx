import { LanguageType } from "@prisma/client";
import {
  getTeamDataByDomainOrCustomDomainMetadata,
  getTeamDataByDomainOrCustomDomainPage,
} from "@/lib/data/domain";
import { notFound } from "next/navigation";
import { basePublicUrl } from "@/lib/helper/images";
import { ReactNode } from "react";
import Header from "@/components/headerNew";
import { TeamAssistantProvider } from "@/components/context/teamAssistantContext";
import {
  ClientLanguageProvider,
  Language,
} from "@/components/context/clientLanguageContext";

export const generateMetadata = async ({
  params,
}: {
  params: { domain: string };
}) => {
  const domain = decodeURIComponent(params.domain);
  const data = await getTeamDataByDomainOrCustomDomainMetadata(domain);

  if (!data) {
    return null;
  }

  return {
    title: `${data.name}`,
    description: data.name || "",
    openGraph: {
      title: data.name,
      description: data.name || "",
      images: data.logoUrl
        ? [
            `${basePublicUrl}/${typeof data.logoUrl === "string" && data.logoUrl}`,
          ]
        : [],
    },

    icons: {
      icon: [
        {
          url: data?.symbolUrl
            ? `${basePublicUrl}/${typeof data?.symbolUrl === "string" && data?.symbolUrl}`
            : "/chatbotforSymbol.svg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.name || "",
      images: data.logoUrl
        ? [
            `${basePublicUrl}/${typeof data.logoUrl === "string" && data.logoUrl}`,
          ]
        : [],
      creator: "netraluis and anton odena",
    },
    // metadataBase: new URL(`${data?.customDomain ? `https://${data.customDomain}`: `https://${domain}`}`),
  };
};

export default async function DomainLayout({
  params,
  children,
}: {
  params: { domain: string; lang: string };
  children: ReactNode;
}) {
  const data = await getTeamDataByDomainOrCustomDomainPage({
    domain: decodeURIComponent(params.domain),
    language: params.lang.toLocaleUpperCase() as LanguageType,
  });

  if (!data || !params.lang) {
    notFound();
  }

  return (
    <html lang="en">
      <head>
        <title>{data.name}</title>
        <meta name="description" content="Descripción genérica" />
        <link
          rel="icon"
          href={
            `${basePublicUrl}${typeof data?.symbolUrl === "string" && data?.symbolUrl}` ||
            "/chatbotforSymbol.svg"
          }
        />
      </head>
      <body>
        <ClientLanguageProvider
          userLanguage={params.lang.toLocaleUpperCase() as Language}
        >
          <TeamAssistantProvider initialData={data}>
            <Header />
            <main>{children}</main>
          </TeamAssistantProvider>
        </ClientLanguageProvider>
      </body>
    </html>
  );
}
