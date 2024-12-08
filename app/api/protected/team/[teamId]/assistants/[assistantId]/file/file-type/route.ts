import { getAssistant } from "@/lib/data/assistant";
import { VectorStoreFile, SuccessfullResponse } from "@/types/types";
import { FileType, File } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getFiles } from "@/lib/data/file";

export async function GET(
  req: NextRequest,
  { params }: { params: { assistantId: string; fileType: FileType } },
) {
  const assistant = await getAssistant(params.assistantId);
  if (!assistant) {
    return NextResponse.json({
      status: 400,
      message: "Assistant not found",
    });
  }

  if (!Object.values(FileType).includes(params.fileType as FileType)) {
    return NextResponse.json({
      status: 400,
      message: "Invalid file type",
    });
  }

  try {
    const getFilesResponse = (
      await getFiles({
        assistantId: params.assistantId,
        type: FileType[params.fileType],
      })
    ).map((file: File) => {
      return { ...file, isCharging: false };
    });

    const response: SuccessfullResponse<VectorStoreFile[]> = {
      status: 200,
      data: getFilesResponse,
    };
    return NextResponse.json(response);
  } catch (e: any) {
    console.error("Error getting files:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
