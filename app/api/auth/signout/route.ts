import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient();

    // Check if a user's logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return new NextResponse(JSON.stringify({ error: error }), {
          status: 400,
        });
      }
    }

    return new NextResponse(JSON.stringify({}), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    });
  }

  // revalidatePath("/", "layout");

  // const subdomainUrl = new URL(
  //   `${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}${req.headers.get("host")}/login`,
  // );
  // return NextResponse.redirect(new URL(subdomainUrl, req.url), {
  //   status: 302,
  // });
}
