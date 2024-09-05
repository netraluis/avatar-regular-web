import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que la clave no sea pública
});

export async function POST(req: Request) {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const formData = await req.formData();
    const audioFile = formData.get("audioFile") as File;
    const language = (formData.get("language") as string) || "en";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Realizar la transcripción
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: audioFile,
      language: language, // Por defecto usa inglés si no se proporciona otro idioma
    });

    return NextResponse.json({ transcription: response.text }, { status: 200 });
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { error: "Error during transcription" },
      { status: 500 },
    );
  }
}
