import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, password } = await request.json();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
  return new NextResponse(JSON.stringify({ email }), {
    status: 200,
  });
}
