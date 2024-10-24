import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");

  const subdomainUrl = new URL(
    `${process.env.PROTOCOL ? process.env.PROTOCOL : "https://"}${req.headers.get("host")}/login`,
  );
  return NextResponse.redirect(new URL(subdomainUrl, req.url), {
    status: 302,
  });
}
