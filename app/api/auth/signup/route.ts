import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, password } = await request.json();

  const response = await supabase.auth.signUp({ email, password });

  if (response.error) {
    return new NextResponse(JSON.stringify({ error: response.error.message }), {
      status: 400,
    });
  }
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}
