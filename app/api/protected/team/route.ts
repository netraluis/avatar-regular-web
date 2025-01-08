import { createTeam, getTeamByTeamId, getTeamsByUser, getAllTeams } from "@/lib/data/team";
import { getUserById } from "@/lib/data/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const {isSuperAdmin} = await getUserById(userId)
    

    const teams = isSuperAdmin ? await getAllTeams() : await getTeamsByUser(userId);

    const response = {
      teams,
      teamSelected: {},
    };

    if (teams.length > 0 && teams[0].id) {
      const teamSelected = await getTeamByTeamId(teams[0].id, userId);
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
