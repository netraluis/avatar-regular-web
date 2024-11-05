import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import OpenAI from "openai";
import { getAssistant } from "@/lib/data/assistant";
import { FilePurpose } from "openai/resources/files.mjs";
import { FileType, Prisma } from "@prisma/client";
import { createFile } from "@/lib/data/file";

const pump = promisify(pipeline);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

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
  { params }: { params: { assistantId: string; fileType: string } },
) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const assistantId = formData.get("assistantId") as string;
    const purpose = formData.get("purpose") as FilePurpose;

    if (!Object.values(FileType).includes(params.fileType as FileType)) {
      return NextResponse.json({
        status: 400,
        message: "Invalid file type",
      });
    }

    if (files.length === 0) {
      return NextResponse.json({
        status: 400,
        message: "No files provided",
      });
    }

    const assistant = await getAssistant(assistantId);

    if (!assistant) {
      return NextResponse.json({
        status: 400,
        message: "Assistant not found",
      });
    }

    const uploadResults = [];

    // Define the temporary directory for file uploads
    const uploadDir = "/tmp";

    for (const file of files) {
      const filePath = path.join(uploadDir, file.name);
      const nodeStream = webToNodeReadable(file.stream());
      await pump(nodeStream, fs.createWriteStream(filePath));

      // Upload each file to OpenAI
      const uploadedFile: OpenAI.Files.FileObject = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: purpose,
      });

      await openai.beta.vectorStores.files.create(
        assistant.openAIVectorStoreFileId,
        {
          file_id: uploadedFile.id,
        },
      );

      // Delete the temporary file after upload
      await fs.promises.unlink(filePath);

      const createdFile: Prisma.FileCreateInput = {
        openAIVectorStoreId: assistant.openAIVectorStoreFileId,
        openAiFileId: uploadedFile.id,
        type: params.fileType as FileType,
        filename: uploadedFile.filename,
        bytes: uploadedFile.bytes,
        assistant: {
          connect: { id: assistantId }, // Conecta el `File` al `Assistant` existente
        },
      };

      await createFile(createdFile);

      uploadResults.push(createdFile);
    }

    return NextResponse.json({ status: 200, data: uploadResults });
  } catch (e: any) {
    console.error("File upload error:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
