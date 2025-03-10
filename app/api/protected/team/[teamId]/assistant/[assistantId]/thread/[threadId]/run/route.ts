import { getAssistant } from "@/lib/data/assistant";
import { AssistantEventType, commonOnEvent } from "@/lib/helper/threadMessage";
import { createRun } from "@/lib/openAI/run";
import { ModeMessageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string; assistantId: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    const { threadId, assistantId } = params;

    const localAssistant = await getAssistant(assistantId as string);

    if (!localAssistant) {
      return new NextResponse("Assistant not found", {
        status: 404,
      });
    }

    // Crear el stream de respuesta para el cliente
    const stream = new ReadableStream({
      async start(controller) {
        // Definir el callback para manejar cada evento
        const onEvent = async (event: AssistantEventType) => {
          await commonOnEvent(
            event,
            controller,
            localAssistant.id,
            userId ? ModeMessageType.TEST : ModeMessageType.PROD,
          );
        };
        try {
          // Ejecutar la función y manejar los eventos conforme llegan
          await createRun({
            assistantId: localAssistant?.openAIId,
            threadId: threadId as string,
            onEvent, // Pasamos el callback onEvent
          });

          // Cerramos el stream cuando se hayan procesado todos los eventos
          controller.close();
        } catch (error) {
          controller.error(error); // En caso de error, notificamos al cliente
        }
      },
    });

    // Retornar el stream de eventos progresivos
    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error running thread", error);

    return new NextResponse("Failed running thread", {
      status: 500,
    });
  }
}
