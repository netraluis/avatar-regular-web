import { createAssistantByTeam } from "@/lib/data/assistant";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     const userId = request.headers.get("x-user-id");

//     if (!userId) {
//       return new NextResponse("user need to be log in", {
//         status: 400,
//       });
//     }

//     const body = await request.json();
//     if(!body.assistantId){
//       return new NextResponse("assistant id is required", {
//         status: 400,
//       });
//     }

//     const assitant = await getAssistantById(body.assistantId);

//     return new NextResponse(JSON.stringify(assitant), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error retrieving user id:", error);

//     return new NextResponse("Failed retrieving user id", {
//       status: 500,
//     });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();

    const { teamId, assistantCreateParams, url } = body;

    if (!teamId) {
      return new NextResponse("team id is required", {
        status: 400,
      });
    }

    if (!assistantCreateParams) {
      return new NextResponse("assistant create input is required", {
        status: 400,
      });
    }

    if (!url) {
      return new NextResponse("url input is required", {
        status: 400,
      });
    }

    const newInternAssistant = await createAssistantByTeam(
      teamId,
      url,
      assistantCreateParams,
    );

    return new NextResponse(JSON.stringify(newInternAssistant), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating team:", error);

    return new NextResponse("Failed creating team", {
      status: 500,
    });
  }
}
