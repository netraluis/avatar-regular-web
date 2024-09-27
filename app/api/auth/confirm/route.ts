import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = "/login";

  console.log("antes", { token_hash, type });

  // Create redirect link without the secret token
  const redirectTo = req.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  console.log({ token_hash, type });

  if (token_hash && type) {
    console.log("verifying otp");
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type: "email",
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
    console.log({ error });
  }

  console.log("todo bien");

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });
}
