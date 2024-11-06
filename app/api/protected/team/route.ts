import { createTeam, getTeamsByUser } from "@/lib/data/team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const teams = await getTeamsByUser(userId);

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

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();
    console.log("body", body);

    if (!body.name) {
      return new NextResponse("team name is required", {
        status: 400,
      });
    }

    const teamResult = await createTeam({
      data: body,
      userId,
    });

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
