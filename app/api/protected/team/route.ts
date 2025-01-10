import { createTeam, getTeamByTeamId, getTeamsByUser } from "@/lib/data/team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "4", 10);

    const teams = await getTeamsByUser({ page, pageSize });

    const response = {
      teams: teams.data,
      meta: teams.meta,
      teamSelected: {},
    };

    if (teams.data.length > 0 && teams.data[0].id) {
      const teamSelected = await getTeamByTeamId({ teamId: teams.data[0].id });
      if (teamSelected) {
        response.teamSelected = teamSelected;
      }
    }

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

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();

    if (!body.name) {
      return new NextResponse("team name is required", {
        status: 400,
      });
    }

    const teamResult = await createTeam({
      data: body,
      userId,
    });

    if (teamResult.errorCode) {
      return new NextResponse(JSON.stringify(teamResult), {
        status: 400,
      });
    }

    return new NextResponse(JSON.stringify(teamResult), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating team:", error);

    return new NextResponse("Failed creating team", {
      status: 500,
    });
  }
}
