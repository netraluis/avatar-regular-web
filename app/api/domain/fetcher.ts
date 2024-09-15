import { unstable_cache } from "next/cache";
import prisma from "../../../lib/prisma";
import { createClient } from "@/lib/supabase/server";

// export async function getDomainData(domain: string) {
//     const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
//       ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
//       : null;

//     return await unstable_cache(
//       async () => {
//         return await db.query.sites.findFirst({
//           where: subdomain
//             ? eq(sites.subdomain, subdomain)
//             : eq(sites.customDomain, domain),
//           with: {
//             user: true,
//           },
//         });
//       },
//       [`${domain}-metadata`],
//       {
//         revalidate: 900,
//         tags: [`${domain}-metadata`],
//       },
//     )();
//   }

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
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  const subdomainInfo = await prisma.domains.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
  });
  if (!subdomainInfo) {
    return null;
  }

  const logo = await getPublicUrlImageimport(`logos/${subdomainInfo.id}.png`);

  return {
    ...subdomainInfo,
    logo,
  };
}
