import { NextRequest, NextResponse } from "next/server";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } },
) {
  console.log("llego a la ruta");

  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }

  const paddle = new Paddle(process.env.PADDLE_API_KEY, {
    environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
    logLevel: LogLevel.verbose, // or 'error' for less verbose logging
  });

  try {
    const subs = await paddle.subscriptions.get(params.subscriptionId);
    return new NextResponse(JSON.stringify(subs), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } },
) {
  console.log("llego a la ruta");

  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }

  const body = await request.json();

  const paddle = new Paddle(process.env.PADDLE_API_KEY, {
    environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
    logLevel: LogLevel.verbose, // or 'error' for less verbose logging
  });

  try {
    const subs = await paddle.subscriptions.update(params.subscriptionId, {
      items: [
        {
          priceId: body.priceId,
          quantity: 1,
        },
      ],
      prorationBillingMode: "prorated_immediately",
    });

    return new NextResponse(JSON.stringify(subs), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
