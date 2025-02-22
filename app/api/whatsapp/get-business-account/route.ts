import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken)
    return NextResponse.json({ error: "No access token" }, { status: 400 });

  const response = await fetch(
    `https://graph.facebook.com/v20.0/me?fields=id,name,whatsapp_business_accounts&access_token=${accessToken}`
  );
  const data = await response.json();

  if (!data.whatsapp_business_accounts)
    return NextResponse.json(
      { error: "No se encontraron cuentas de WhatsApp" },
      { status: 404 }
    );

  return NextResponse.json({
    whatsapp_business_account_id: data.whatsapp_business_accounts.data[0].id,
  });
}
