"use server";
import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import "../globals.css";
import { GlobalProvider } from "@/components/context/globalContext";
import Header from "@/components/header";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/domain/${domain}`,
  //   {
  //     method: "GET",
  //   },
  // );
  // if (!response.ok) {
  //   throw new Error(`Error fetching domain data: ${response.statusText}`);
  // }
  // const domainData = await response.json();
  // console.log("getDat", domainData);
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
  // const data = await getDomain(domain);

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
