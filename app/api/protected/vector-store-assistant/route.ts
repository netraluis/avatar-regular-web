import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import OpenAI from "openai";
import { getAssistant } from "@/lib/data/assistant";
import { FilePurpose } from "openai/resources/files.mjs";

const pump = promisify(pipeline);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Convierte un Web API ReadableStream a Node.js Readable
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

export async function POST(req: NextRequest) {
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
    const { openAIVectorStoreId } = assistant;

    const uploadResults = [];

    // Define el directorio absoluto de carga de archivos
    const uploadDir = path.join(process.cwd(), "public", "file");

    // Verifica si el directorio existe, si no, lo crea
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Crea el directorio y sus padres si es necesario
    }

    for (const file of files) {
      const filePath = path.join(uploadDir, file.name);
      const nodeStream = webToNodeReadable(file.stream());
      await pump(nodeStream, fs.createWriteStream(filePath));

      // Subir cada archivo a OpenAI
      const uploadedFile = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: purpose,
      });

      await openai.beta.vectorStores.files.create(openAIVectorStoreId, {
        file_id: uploadedFile.id,
      });

      // Elimina el archivo temporal
      await fs.promises.unlink(filePath);

      uploadResults.push(uploadedFile);
    }

    return NextResponse.json({ status: 200, data: uploadResults });
  } catch (e: any) {
    console.error("File upload error:", e);
    return NextResponse.json({ status: 500, message: e.message });
  }
}
