import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    console.log("llego");
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) return NextResponse.json({ error: "No se recibió código" }, { status: 400 });

    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_META_REDIRECT_URI}&code=${code}`, {
        method: "GET",
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) return NextResponse.json({ error: "No se pudo obtener el token" }, { status: 500 });

    // Aquí puedes guardar el token en tu base de datos junto con el usuario
    console.log("Token de acceso obtenido:", tokenData.access_token);

    return NextResponse.json({ success: true, accessToken: tokenData.access_token });
}
