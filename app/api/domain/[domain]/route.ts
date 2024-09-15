import { getDomainData } from "../fetcher";

export async function GET(
  req: Request,
  { params }: { params: { domain: string } },
) {
  try {
    console.log("params", params);
    const domain = params.domain;
    await getDomainData(domain);
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}
