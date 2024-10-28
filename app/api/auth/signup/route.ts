import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  console.log("Signup request received");

  const { email, password } = await request.json();

  console.log({ email, password})

  const { error } = await supabase.auth.signUp({ email, password });
  console.log({ error });

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 400,
      })
  }
  return new NextResponse(JSON.stringify({email}), {
    status: 200,
  });
}
