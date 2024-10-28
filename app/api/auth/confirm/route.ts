import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get("token_hash");
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const next = "/login";

  console.log("antes", { token_hash, type });

  // Create redirect link without the secret token
  const redirectTo = req.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("email");

  console.log({ token_hash, type });

  if (token_hash && type && email) {
    console.log("verifying otp");
    const supabase = createClient();

    const { error, data } = await supabase.auth.verifyOtp({
      email: email,
      type: "email",
      token: token_hash,
    });

    console.log({ error, data });

    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });
}
