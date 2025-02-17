import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { email, password } = await request.json();

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/confirm`,
    },
  });

  if (response.error) {
    return new NextResponse(JSON.stringify({ error: response.error.code }), {
      status: 400,
    });
  }

  if (!process.env.SLACK_URL_USER) {
    throw "SLACK_URL_USER is not defined";
  }

  await fetch(process.env.SLACK_URL_USER as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: JSON.stringify(
        {
          event: "user_signup",
          email: email,
          userId: response.data.user?.id,
        },
        null,
        2,
      ), // `null, 2` para formato legible en Slack
    }),
  });
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}
