import { NextResponse, NextRequest } from "next/server";
import sendEmail from "@/lib/supabase/send-emails/index";

export async function POST(request: NextRequest) {
  try {
    // const userId = request.headers.get("x-user-id");

    // if (!userId) {
    //   return new NextResponse("user need to be log in", {
    //     status: 400,
    //   });
    // }

    const { body } = await request.json();

    console.log({ body});

    // console.log({ body });

    //   const newInternAssistant = await createAssistantByTeam(
    //     teamId,
    //     body.assistantCreateParams,
    //   );

    const resEmail = await sendEmail({
      user: body.user,
      email_data: body.email_data,
    });

    console.log("Email sent", resEmail);

    return new NextResponse(JSON.stringify({ body: "hola" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating team:", error);

    return new NextResponse("Failed creating team", {
      status: 500,
    });
  }
}
