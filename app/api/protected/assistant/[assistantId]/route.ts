import { deleteAssistant, getAssistant } from "@/lib/data/assistant";
import { getAssistantById, modifyAssistantById } from "@/lib/openAI/assistant";
import { Assistant } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(
  request: NextRequest,
  { params }: { params: { assistantId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }
    const localAssistant: Assistant | null = await getAssistant(
      params.assistantId as string,
    );
    if (!localAssistant) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    const assistant: OpenAI.Beta.Assistants.Assistant = await getAssistantById(
      localAssistant?.openAIId as string,
    );

    if (!assistant) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    const response = { ...localAssistant, ...assistant };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { assistantId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const teams = await deleteAssistant(params.assistantId);

    return new NextResponse(JSON.stringify(teams), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { assistantId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();

    const localAssistant: Assistant | null = await getAssistant(
      params.assistantId as string,
    );
    if (!localAssistant) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    const assistant: OpenAI.Beta.Assistants.Assistant =
      await modifyAssistantById(localAssistant?.openAIId as string, body);

    return new NextResponse(JSON.stringify(assistant), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const userId = request.headers.get("x-user-id");

//     if (!userId) {
//       return new NextResponse("user need to be log in", {
//         status: 400,
//       });
//     }

//     const body = await request.json();

//     if (!body.teamName) {
//       return new NextResponse("team name is required", {
//         status: 400,
//       });
//     }

//     const teamResult = await createTeam({
//       team: { teamName: body.teamName },
//       userId,
//     });

//     return new NextResponse(JSON.stringify(teamResult), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error creating team:", error);

//     return new NextResponse("Failed creating team", {
//       status: 500,
//     });
//   }
// }
