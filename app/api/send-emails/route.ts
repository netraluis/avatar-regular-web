import { NextResponse, NextRequest } from "next/server";
// import sendEmail from "@/lib/supabase/send-emails/index";

export async function POST(request: NextRequest) {
  try {
    // const userId = request.headers.get("x-user-id");

    // if (!userId) {
    //   return new NextResponse("user need to be log in", {
    //     status: 400,
    //   });
    // }

    // const { user, email_data } = await request.json();

    // console.log({ user, email_data });

    // // const resEmail = await sendEmail({
    // //   user: user,
    // //   email_data: email_data,
    // // });

    // console.log("Email sent", 'sin email');

    return new NextResponse(JSON.stringify({ body: "hola" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error getting token_hash:", error);

    return new NextResponse("Failed getting token_hash", {
      status: 500,
    });
  }
}
