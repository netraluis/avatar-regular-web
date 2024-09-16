"use server";
// import prisma from "../../lib/prisma";
import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
// import { getDomainData } from "@/lib/fetchers";
import { Metadata } from "next";
// import { getDomainData } from "@/lib/domain/serverHelpers";
import "../globals.css";
import { GlobalProvider } from "@/components/context/globalContext";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";

const getPublicUrlImageimport = async (fileName: string) => {
  const supabase = createClient();

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  return data.publicUrl;
};

async function getDomainData(domain: string) {
  console.log("Domain:", domain, process.env.NEXT_PUBLIC_ROOT_DOMAIN);
  const rootDomain =
    `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` || ".localhost:3000";
  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  console.log("Subdomain:", subdomain);

  // const subdomainInfo = await prisma.domains.findFirst({
  //   where: subdomain
  //     ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
  //     : { customDomain: domain }, // Otherwise, filter by customDomain
  // });

  const subdomainInfo = {
    assistantId: "asst_lwr5WIVDFjoV8pL0CHic2BFd",
    assistantName: "AI Andorra UE",
    createdAt: "2024-09-15T07:40:15.585Z",
    customDomain: "null",
    id: "fm11ujxfx0000137h7qmc5f73",
    logo: "https://sjgdbtgjgkkmztduxohh.supabase.co/storage/v1/object/public/images/logos/fm11ujxfx0000137h7qmc5f73.png",

    menufooter: "Fet amb 🖤  a Andorra i per andorra",
    name: "andorra UE",
    subDomain: "andorraue",
    welcome: "Benvingut a Andorra UE",
  };

  if (!subdomainInfo) {
    return null;
  }

  const logo = await getPublicUrlImageimport(`logos/${subdomainInfo.id}.png`);
  console.log("Logo:", logo);

  return {
    ...subdomainInfo,
    logo,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getDomainData(domain);

  // const data = subdomainInfo;
  // const data = {
  //   name: "test",
  //   description: "test",
  //   image: "test",
  //   logo: "test",
  // };
  if (!data) {
    return null;
  }
  // const {
  //   name,
  //   description,
  //   logo,
  // } = data as {
  //   name: string;
  //   description: string;
  //   logo: string;
  // };

  return {
    title: data.name,
    description: data.welcome,
    openGraph: {
      title: data.name,
      description: data.welcome,
      images: [data.logo ? data.logo : ""],
    },
    icons: [data.logo ? data.logo : ""],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  };
}

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  const domain = decodeURIComponent(params.domain);
  // const data = await getDomainData(domain);

  const subdomainInfo = {
    assistantId: "asst_lwr5WIVDFjoV8pL0CHic2BFd",
    assistantName: "AI Andorra UE",
    createdAt: "2024-09-15T07:40:15.585Z",
    customDomain: "null",
    id: "fm11ujxfx0000137h7qmc5f73",
    logo: "https://sjgdbtgjgkkmztduxohh.supabase.co/storage/v1/object/public/images/logos/fm11ujxfx0000137h7qmc5f73.png",

    menufooter: "Fet amb 🖤  a Andorra i per andorra",
    name: "andorra UE",
    subDomain: "andorraue",
    welcome: "Benvingut a Andorra UE",
  };

  const data = subdomainInfo;

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.customDomain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.customDomain}`);
  }

  return (
    <html lang="en">
      <GlobalProvider>
        <body>
          <Header domain={domain} />
          {children}
        </body>
      </GlobalProvider>
    </html>
  );
}
