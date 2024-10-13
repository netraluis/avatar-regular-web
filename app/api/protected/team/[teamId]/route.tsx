import { getTeamByTeamId } from "@/lib/data/team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

    // Extraer los parámetros de la ruta
    const { teamId } = params;

    if (!teamId) {
      return new NextResponse("teamId is required", {
        status: 400,
      });
    }

    const teams = await getTeamByTeamId(teamId, userId);

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
