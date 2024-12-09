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

export async function PATCH(
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

    const body = await request.json();

    if (!body?.data) {
      return new NextResponse("data is required", {
        status: 400,
      });
    }

    const team = await updateTeam({
      teamId,
      data: body.data as Prisma.TeamUpdateInput,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { teamId: string } },
) {
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

  try {
    const assitantsTeams = await getAssistantsByTeam(teamId, userId);

    if (assitantsTeams && assitantsTeams.assistants) {
      for (const assistants of assitantsTeams.assistants) {
        const filesFromAssistant = await getFiles({
          assistantId: assistants.id,
        });

        for (const file of filesFromAssistant) {
          await deleteFile({ fileId: file.openAIFileId });
          await deleteFileLocally({ openAIFileId: file.openAIFileId });
        }

        const deletedAssistant = await deleteAssistant(assistants.id);

        const { openAIVectorStoreFileId } = deletedAssistant;

        await deleteVectorStoreFile(openAIVectorStoreFileId);
      }
    }

    const team = await deleteTeam({ teamId });

    return new NextResponse(JSON.stringify(team), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting team:", error);

    return new NextResponse("Failed deleteing team", {
      status: 500,
    });
  }
}
