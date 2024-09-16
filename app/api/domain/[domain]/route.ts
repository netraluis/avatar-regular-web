import prisma from "../../../../lib/prisma";
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

  const subdomainInfo = await prisma.domains.findFirst({
    where: subdomain
      ? { subDomain: subdomain } // If subdomain is true, filter by subdomain
      : { customDomain: domain }, // Otherwise, filter by customDomain
  });

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
