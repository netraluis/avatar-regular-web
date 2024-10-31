import { deleteFile } from "@/lib/openAI/file";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } },
) {
  if (!params.fileId) {
    return NextResponse.json({
      status: 400,
      message: "file is required",
    });
  }

  try {
    const files = await deleteFile({ fileId: params.fileId });

    return NextResponse.json({ status: 200, fileId: files.id });
  } catch (e: any) {
    console.error("Error getting files:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
