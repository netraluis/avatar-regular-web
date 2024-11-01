import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const redirectUri = "https://app.netraluis.com/notion";
    const encoded = Buffer.from(
      `${process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}:${process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET}`
    ).toString("base64");

    const body = await request.json();
    const { code } = body;

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    console.log("data access_token back", data);
    const accessToken = data.access_token;

    // Retornar el stream de eventos progresivos
    return new NextResponse(accessToken, {
      //   headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error running thread", error);

    return new NextResponse("Failed running thread", {
      status: 500,
    });
  }
}
