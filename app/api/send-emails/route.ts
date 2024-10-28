import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const SUPABASE_HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET; // Asegúrate de que esto esté definido en tu .env
  try {
    // Extrae el secreto del encabezado de la solicitud
    // const secret = request.headers.get("x-secret-key");

    console.log(request.headers)
    const data = await request.json();
    console.log({data});

    // Verifica si el secreto coincide con el configurado en Supabase
    // if (!secret || secret !== SUPABASE_HOOK_SECRET) {
    //   return new NextResponse("Unauthorized", {
    //     status: 401,
    //   });
    // }

    const url = new URL(request.url);
    const secretQuery = url.searchParams.get("secret");

    console.log("Parámetro 'secret' en query:", secretQuery, url);

    // Procesa la solicitud después de la verificación del secreto
    console.log("Solicitud autorizada desde Supabase Hook");
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");

    return new NextResponse(
      JSON.stringify({ body: "Email hook recibido y autorizado" }),
      {
        status: 200,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error("Error procesando el hook:", error);

    return new NextResponse("Error procesando el hook", {
      status: 500,
    });
  }
}
