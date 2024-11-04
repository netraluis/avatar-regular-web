import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { databaseId: string } },
) {
  try {
    const accessToken = request.headers.get("x-acccess-token");

    if (!accessToken) {
      return new NextResponse("access token is needed", {
        status: 400,
      });
    }

    const databaseResponse = await fetch(
      `https://api.notion.com/v1/databases/${params.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Notion-Version": "2022-06-28",
        },
      },
    );

    const data = await databaseResponse.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving database id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}
