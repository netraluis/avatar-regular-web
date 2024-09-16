import { getDomainData } from "../../../../lib/serverHelpers";

export async function GET(
  req: Request,
  { params }: { params: { domain: string } },
) {
  try {
    const domain = await getDomainData(params.domain);

    return Response.json({ domain, status: 200 });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}
