import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import OpenAI from "openai";
import { getAssistant } from "@/lib/data/assistant";
import { FilePurpose } from "openai/resources/files.mjs";
import { VectorStoreTypeEnum } from "@/types/types";

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
  {
    params,
  }: { params: { assistantId: string; vectorStoreType: VectorStoreTypeEnum } },
) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const assistantId = formData.get("assistantId") as string;
    const purpose = formData.get("purpose") as FilePurpose;

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

    let vectorStoreId;
    switch (params.vectorStoreType) {
      case VectorStoreTypeEnum.FILE:
        vectorStoreId = assistant.openAIVectorStoreFileId;
        break;
      case VectorStoreTypeEnum.NOTION:
        vectorStoreId = assistant.openAIVectorStoreNotionId;
        break;
      default:
        return NextResponse.json({
          status: 400,
          message: "Invalid vector store type",
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
      const uploadedFile = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: purpose,
      });

      await openai.beta.vectorStores.files.create(vectorStoreId, {
        file_id: uploadedFile.id,
      });

      // Delete the temporary file after upload
      await fs.promises.unlink(filePath);

      uploadResults.push(uploadedFile);
    }

    return NextResponse.json({ status: 200, data: uploadResults });
  } catch (e: any) {
    console.error("File upload error:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
