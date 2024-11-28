import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email } = await request.json();
  const decodedEmail = decodeURIComponent(email || "").replace(/\s/g, "+");

  try {
    const { error, data } = await supabase.auth.signInWithOtp({
      email: decodedEmail,
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
