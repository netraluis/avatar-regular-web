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

    console.log({ accessToken, databaseId: params.databaseId });

    const databaseResponse = await fetch(
      `hhttps://api.notion.com/v1/databases/${params.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Notion-Version": "2022-06-28",
        },
      },
    );

    return new NextResponse(JSON.stringify(databaseResponse), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}
