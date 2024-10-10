import { getAssistantsByTeam } from "@/lib/data/assistant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
  try {
    // Extraer los parámetros de la ruta
    const { teamId } = params;

    console.log("teamId sdasd", { teamId });

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
