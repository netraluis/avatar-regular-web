import { getAssistant } from "@/lib/data/assistant";
import { createThreadAndRun } from "@/lib/openAI/run";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return new NextResponse("user need to be log in", {
        status: 400,
      });
    }

    const body = await request.json();

    const localAssistant = await getAssistant(body.assistantId as string);

    if (!localAssistant) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        // Definir el callback para manejar cada evento
        const onEvent = (
          event: OpenAI.Beta.Assistants.AssistantStreamEvent,
        ) => {
          // Enviar el evento al cliente en cuanto lo recibes
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify(event) + "\n"),
          );
        };

        try {
          // Ejecutar la función y manejar los eventos conforme llegan
          await createThreadAndRun({
            assistantId: localAssistant?.openAIId,
            message: body.message,
            onEvent, // Pasamos el callback onEvent
          });

          // Cerramos el stream cuando se hayan procesado todos los eventos
          controller.close();
        } catch (error) {
          controller.error(error); // En caso de error, notificamos al cliente
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error creating thread and run :", error);

    return new NextResponse("Failed creating thread and run ", {
      status: 500,
    });
  }
}
