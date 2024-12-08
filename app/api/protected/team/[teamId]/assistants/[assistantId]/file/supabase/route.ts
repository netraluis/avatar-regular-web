import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import { createClient } from "@/lib/supabase/server";
import { FileUserImageType } from "@/types/types";

const pump = promisify(pipeline);

// Convert a Web API ReadableStream to Node.js Readable
function webToNodeReadable(webStream: ReadableStream): Readable {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}

export async function POST(
  req: NextRequest,
  // { params }: { params: { assistantId: string; fileType: string } },
) {
  const supabase = createClient();

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({
      status: 400,
      message: "User need to be logged in",
    });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const teamId = formData.get("teamId") as string;
    const fileUserImageType = formData.getAll(
      "fileUserImageType",
    ) as unknown as FileUserImageType;

    if (files.length === 0) {
      return NextResponse.json({
        status: 400,
        message: "No files provided",
      });
    }

    const uploadDir = "/tmp";

    const file = files[0];

    const filePath = path.join(uploadDir, file.name);
    const nodeStream = webToNodeReadable(file.stream());
    await pump(nodeStream, fs.createWriteStream(filePath));

    const fileData = file;
    const { name } = fileData;
    const fileExtension = name.split(".").pop();
    const { data, error } = await supabase.storage
      .from("user-images")
      .upload(
        `/${teamId}/${fileUserImageType}/${fileUserImageType}.${fileExtension}`,
        file,
        { upsert: true },
      );

    if (error) {
      return NextResponse.json({ status: 500, message: error });
    }

    return NextResponse.json({ status: 200, data: data.fullPath });
  } catch (e: any) {
    console.error("File upload error:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
