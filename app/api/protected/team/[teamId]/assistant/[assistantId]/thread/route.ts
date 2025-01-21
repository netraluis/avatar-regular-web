import { getAssistant } from "@/lib/data/assistant";
import { AssistantEventType, commonOnEvent } from "@/lib/helper/threadMessage";
import { createThreadAndRun } from "@/lib/openAI/run";
import { ModeMessageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

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
          event: AssistantEventType,
        ) => {
          commonOnEvent(
            event,
            controller,
            localAssistant.id,
            userId ? ModeMessageType.TEST : ModeMessageType.PROD,
            body.message,
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
          console.error("Error creating thread and run :", error);
          controller.error(error); // En caso de error, notificamos al cliente
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error creating thread and run :", error);

    return new NextResponse("Failed creating thread and run ", {
      status: 500,
    });
  }
}
