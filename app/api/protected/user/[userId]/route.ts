import { getFiles } from "@/lib/data/file";
import { deleteFile } from "@/lib/openAI/file";
import { deleteAssistant } from "@/lib/data/assistant";
import { deleteFile as deleteFileLocally } from "@/lib/data/file";
import { deleteVectorStoreFile } from "@/lib/openAI/vector-store";
import {
  deleteTeam,
  getAssistantsByTeam,
  getTeamByTeamId,
  updateTeam,
} from "@/lib/data/team";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/data/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    // const userId = request.headers.get("x-user-id");

    // if (!userId) {
    //   return new NextResponse("user need to be log in", {
    //     status: 400,
    //   });
    // }

    // Extraer los parámetros de la ruta
    const { userId } = params;

    if (!userId) {
      return new NextResponse("teamId is required", {
        status: 400,
      });
    }

    const teams = await getUserById(userId);

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
  { params }: { params: { userId: string } },
) {
  try {

    // Extraer los parámetros de la ruta
    const { userId } = params;

    if (!userId) {
      return new NextResponse("userId is required", {
        status: 400,
      });
    }

    const body = await request.json();

    if (!body?.data) {
      return new NextResponse("data is required", {
        status: 400,
      });
    }

    const team = await updateUser({
      userId,
      data: body.data as Prisma.UserUpdateInput,
    });

    if (!team.success) {
      return new NextResponse(JSON.stringify(team), {
        status: 400,
      });
    }

    return new NextResponse(JSON.stringify(team), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating team:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}