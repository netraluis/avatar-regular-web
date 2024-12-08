import {
  getAssistantsByTeam,
  createAssistantByTeam,
} from "@/lib/data/assistant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
  try {
    // Extraer los parámetros de la ruta
    const { teamId } = params;

    if (!teamId) {
      return new NextResponse("teamId is required", {
        status: 400,
      });
    }

    const assistants = await getAssistantsByTeam(teamId);

    return new NextResponse(JSON.stringify(assistants), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving assistant by team id:", error);

    return new NextResponse("Failed retrieving assistant by team id", {
      status: 500,
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const { teamId } = params;

    const body = await request.json();

    const { assistantCreateParams, url } = body;

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
