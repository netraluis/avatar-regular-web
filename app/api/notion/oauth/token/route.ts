import { updateAssistant } from "@/lib/data/assistant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const redirectUri = "https://app.netraluis.com/notion"; // Asegúrate de que coincida con el redirect_uri en la configuración de Notion
    const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET;

    // Codifica las credenciales en Base64
    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

    // Obtén el código de la solicitud
    const body = await request.json();
    const { code, assistantId } = body;

    // Solicitud a la API de Notion para obtener el access_token
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    // Verifica si se obtuvo el access_token
    if (!data.access_token) {
      return NextResponse.json(
        { error: "No se pudo obtener el token de acceso", details: data },
        { status: 400 },
      );
    }

    const accessToken = data.access_token;

    console.log("hago un update de updateAssistant", assistantId, {
      notionAccessToken: accessToken,
    });

    const updateResponse = await updateAssistant(assistantId, {
      notionAccessToken: accessToken,
    });

    console.log("updateResponse", { updateResponse });

    return NextResponse.json({ status: 200, access_token: accessToken });
  } catch (error) {
    console.error("Error obteniendo el token de acceso de Notion", error);
    return NextResponse.json(
      { error: "Failed to fetch access token", details: error },
      { status: 500 },
    );
  }
}
