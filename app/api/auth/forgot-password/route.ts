import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email } = await request.json();
  const decodedEmail = decodeURIComponent(email || "").replace(/\s/g, "+");

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      decodedEmail,
      {
        redirectTo: `${process.env.PROTOCOL ? process.env.PROTOCOL : "https://"}app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/reset-password`,
      },
    );

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.code }), {
        status: 400,
      });
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
