import { getDomainData } from "@/lib/domain/serverHelpers";

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
