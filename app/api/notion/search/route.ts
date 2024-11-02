import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Obtén el código de la solicitud
    const body = await request.json();
    const { accessToken } = body;

    console.log("access token", accessToken);

    // Verifica si se obtuvo el access_token
    if (!accessToken) {
      return NextResponse.json("no access token", { status: 400 });
    }

    const searchResponse = await fetch("https://api.notion.com/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Notion-Version": "2022-06-28", // Asegúrate de usar la versión adecuada de la API
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          value: "page",
          property: "object",
        },
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      }),
    });

    const searchData = await searchResponse.json();
    console.log("Páginas autorizadas:", searchData);

    const pageIds = searchData.results.map((page: any) => page.id);
    // Solicita detalles de cada página usando el ID
    const pageDetails = await Promise.all(
      pageIds.map(async (pageId: any) => {
        const pageResponse = await fetch(
          `https://api.notion.com/v1/pages/${pageId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Notion-Version": "2022-06-28",
            },
          }
        );
        return pageResponse.json();
      })
    );

    console.log("Detalles completos de las páginas:", pageDetails);

    // Retorna el token de acceso como JSON
    return NextResponse.json({ status: 200, data: pageDetails });
  } catch (error: any) {
    console.error("Error obteniendo el token de acceso de Notion", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
