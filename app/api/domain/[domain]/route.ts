import prisma from "../../../../lib/prisma";
import { createClient } from "@/lib/supabase/server";

const getPublicUrlImageimport = async (fileName: string) => {
  const supabase = createClient();

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  return data.publicUrl;
};

async function getDomainData(domain: string) {
  console.log("Domain:", domain, process.env.NEXT_PUBLIC_ROOT_DOMAIN);
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  console.log("Subdomain:", subdomain);

  const subdomainInfo = await prisma.domains.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
  });

  // const subdomainInfo = {
  //   assistantId: "asst_lwr5WIVDFjoV8pL0CHic2BFd",
  //   assistantName: "AI Andorra UE",
  //   createdAt: "2024-09-15T07:40:15.585Z",
  //   customDomain: "null",
  //   id: "fm11ujxfx0000137h7qmc5f73",
  //   logo: "https://sjgdbtgjgkkmztduxohh.supabase.co/storage/v1/object/public/images/logos/fm11ujxfx0000137h7qmc5f73.png",

  //   menufooter: "Fet amb 🖤  a Andorra i per andorra",
  //   name: "andorra UE",
  //   subDomain: "andorraue",
  //   welcome: "Benvingut a Andorra UE",
  // };
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

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: { domain: string } },
) {
  try {
    const domain = await getDomainData(params.domain);

    return Response.json(
      { domain, status: 200 },
      {
        headers: {
          "Access-Control-Allow-Origin": "*", // Enable CORS for all origins
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return Response.json({
      response: "Failed to retrieve access token",
      status: 500,
    });
  }
}
