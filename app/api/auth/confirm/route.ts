import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, otp, type = "email" } = await request.json();
  const decodedEmail = decodeURIComponent(email || "").replace(/\s/g, "+");

  console.log({ email, otp, type });

  try {
    const { error, data } = await supabase.auth.verifyOtp({
      email: decodedEmail,
      type,
      token: otp,
    });

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
