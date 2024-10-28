import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const SUPABASE_HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET; // Asegúrate de que esto esté definido en tu .env
  try {
    // Extrae el secreto del encabezado de la solicitud
    const secret = request.headers.get("x-secret-key");

    // Verifica si el secreto coincide con el configurado en Supabase
    if (!secret || secret !== SUPABASE_HOOK_SECRET) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    // Procesa la solicitud después de la verificación del secreto
    console.log("Solicitud autorizada desde Supabase Hook");

    return new NextResponse(
      JSON.stringify({ body: "Email hook recibido y autorizado" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error procesando el hook:", error);

    return new NextResponse("Error procesando el hook", {
      status: 500,
    });
  }
}
