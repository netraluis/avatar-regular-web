import { getDomainData } from "../../../../lib/domain/serverHelpers";

export async function GET(
  req: Request,
  { params }: { params: { domain: string } },
) {
  try {
    const domain = await getDomainData(params.domain);

    return Response.json({ domain, status: 200 });
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return Response.json({
      response: "Failed to retrieve access token",
      status: 500,
    });
  }
}
