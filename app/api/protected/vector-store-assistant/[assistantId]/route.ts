import { getAssistant } from "@/lib/data/assistant";
import { getFile } from "@/lib/openAI/file";
import { getVectorStoreFiles } from "@/lib/openAI/vector-store";
import { VectorStoreFile, SuccessfullResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { assistantId: string } }
) {
  const assistant = await getAssistant(params.assistantId);
  if (!assistant) {
    return NextResponse.json({
      status: 400,
      message: "Assistant not found",
    });
  }
  const { openAIVectorStoreId } = assistant;

  try {
    const files = await getVectorStoreFiles(openAIVectorStoreId);
    const filesResponse: VectorStoreFile[] = [];
    for (const vectorFile of files.data) {
      const id = vectorFile.id;
      const file = await getFile({ fileId: id });
      filesResponse.push({
        id: file.id,
        filename: file.filename,
        bytes: file.bytes,
        status: file.status,
        isCharging: false,
      });
    }

    const response: SuccessfullResponse<VectorStoreFile[]> = {
      status: 200,
      data: filesResponse,
    };
    return NextResponse.json(response);
  } catch (e: any) {
    console.error("Error getting files:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
