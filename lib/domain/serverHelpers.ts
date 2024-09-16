// import prisma from "../prisma";
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
  console.log("Domain:", domain);
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
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
