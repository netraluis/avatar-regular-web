import prisma from "../prisma";
import { createClient } from "@/lib/supabase/server";

export const getPublicUrlImageimport = async (fileName: string) => {
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

export async function getDomainData(domain: string) {
  const rootDomain =
    `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` || ".localhost:3000";
  const subdomain = domain.endsWith(rootDomain)
    ? domain.replace(rootDomain, "")
    : null;

  console.log({
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    subdomain,
    domain,
    rootDomain,
  });

  const subdomainInfo = await prisma.domains.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
  });

  if (!subdomainInfo) {
    return null;
  }

  const logo = await getPublicUrlImageimport(`logos/${subdomainInfo.logo}`);
  const symbol = subdomainInfo.symbol
    ? await getPublicUrlImageimport(`symbols/${subdomainInfo.symbol}`)
    : null;

  return {
    ...subdomainInfo,
    logo,
    symbol,
  };
}
