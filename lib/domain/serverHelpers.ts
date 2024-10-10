import {
  Domain,
  HeaderDisclaimer,
  MenuBody,
  MenuHeader,
  welcomeCard,
} from "@/components/context/globalContext";
import prisma from "../prisma";
import { createClient } from "@/lib/supabase/server";

export const getPublicUrlImage = async (fileName: string) => {
  const supabase = createClient();

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  return data.publicUrl;
};

export const getPublicLimitedUrlImageimport = async (fileName: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(fileName, 3600);

  if (data) {
    return data.signedUrl;
  }
  if (error) {
    console.error(error);
  }
};

export async function getDomainData(domain: string): Promise<Domain | null> {
  const rootDomain = `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;

  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  const subdomainInfo = await prisma.domains.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
  });

  if (!subdomainInfo) {
    return null;
  }

  const logo = await getPublicUrlImage(`logos/${subdomainInfo.logo}`);
  const symbol = subdomainInfo.symbol
    ? await getPublicUrlImage(`symbols/${subdomainInfo.symbol}`)
    : null;

  return {
    ...subdomainInfo,
    menuHeader: subdomainInfo.menuHeader as unknown as MenuHeader[],
    menuBody: subdomainInfo.menuBody as unknown as MenuBody[],
    headerDisclaimer:
      subdomainInfo.headerDisclaimer as unknown as HeaderDisclaimer,
    logo,
    symbol,
    welcomeCards: subdomainInfo.welcomeCards as unknown as welcomeCard[],
  };
}
