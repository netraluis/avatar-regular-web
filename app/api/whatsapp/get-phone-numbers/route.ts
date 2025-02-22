import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const accessToken = url.searchParams.get("access_token");
    const businessAccountId = url.searchParams.get("business_account_id");

    if (!accessToken || !businessAccountId) return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });

    const response = await fetch(`https://graph.facebook.com/v20.0/${businessAccountId}/phone_numbers?access_token=${accessToken}`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) return NextResponse.json({ error: "No se encontraron números de WhatsApp" }, { status: 404 });

    return NextResponse.json({
        phone_numbers: data.data
    });
}
