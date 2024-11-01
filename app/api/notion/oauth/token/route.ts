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
    const { code } = body;

    // Solicitud a la API de Notion para obtener el access_token
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();
    // Verifica si la respuesta es JSON antes de parsearla
    // const contentType = response.headers.get("content-type");
    // let data;
    // if (contentType && contentType.includes("application/json")) {
    //   data = await response.json();
    // } else {
    //   const text = await response.text();
    //   console.error("Respuesta de Notion no es JSON:", text);
    //   return NextResponse.json({ error: text }, { status: response.status });
    // }

    // Verifica si se obtuvo el access_token
    if (!data.access_token) {
      return NextResponse.json(
        { error: "No se pudo obtener el token de acceso", details: data },
        { status: 400 }
      );
    }

    console.log("data access_token back", data);
    const accessToken = data.access_token;

    // const searchResponse = await fetch("https://api.notion.com/v1/search", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Notion-Version": "2021-08-16", // Asegúrate de usar la versión adecuada de la API
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     filter: {
    //       value: "page",
    //       property: "object",
    //     },
    //   }),
    // });

    // const searchData = await searchResponse.json();
    // console.log("Páginas autorizadas:", searchData);

    // Retorna el token de acceso como JSON
    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("Error obteniendo el token de acceso de Notion", error);
    return NextResponse.json(
      { error: "Failed to fetch access token", details: error },
      { status: 500 }
    );
  }
}
