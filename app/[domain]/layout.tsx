"use server";
import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import "../globals.css";
import { GlobalProvider } from "@/components/context/globalContext";
import Header from "@/components/header";
import { getDomainData } from "@/lib/domain/serverHelpers";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata | null> {
  const domain = decodeURIComponent(params.domain);
  const data = await getDomainData(domain);

  if (!data) {
    return null;
  }

  return {
    title: `${data.name}`,
    description: data.description || "",
    openGraph: {
      title: data.name,
      description: data.description || "",
      images: [data.logo],
    },
    icons: {
      icon: [{ url: data.symbol ? data.symbol : "/chatbotforSymbol.svg" }], // Añade el tipo de imagen
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.description || "",
      images: [data.logo],
      creator: "netraluis and anton odena",
    },
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
  const data = await getDomainData(domain);

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
    <GlobalProvider>
      <Header domain={data} />
      <div>{children}</div>
    </GlobalProvider>
  );
}
