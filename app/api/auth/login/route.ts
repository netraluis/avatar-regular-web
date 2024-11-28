import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, password } = await request.json();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.code }), {
      status: error.status,
    });
  }
  return new NextResponse(JSON.stringify(data), {
    status: 200,
  });
}
