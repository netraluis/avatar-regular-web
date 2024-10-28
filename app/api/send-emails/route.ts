import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();

    console.log({ body });

    //   const newInternAssistant = await createAssistantByTeam(
    //     teamId,
    //     body.assistantCreateParams,
    //   );

    return new NextResponse(JSON.stringify({ body }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating team:", error);

    return new NextResponse("Failed creating team", {
      status: 500,
    });
  }
}
