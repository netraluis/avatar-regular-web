import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, password } = await request.json();

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.PROTOCOL ? process.env.PROTOCOL : "https://"}app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/confirm`,
    },
  });

  if (response.error) {
    return new NextResponse(JSON.stringify({ error: response.error.code }), {
      status: 400,
    });
  }
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}
