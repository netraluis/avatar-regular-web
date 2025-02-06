import { NextRequest, NextResponse } from "next/server";
import {
  Environment,
  LogLevel,
  Paddle,
  ProrationBillingMode,
} from "@paddle/paddle-node-sdk";
import { getProrationBillingMode } from "@/lib/helper/subscription";
// import { changeTokenLedgerMovementSubscription } from "@/lib/data/tokenLedger";

export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } },
) {
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
  { params }: { params: { subscriptionId: string; teamId: string } },
) {
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

  const oldSub = await paddle.subscriptions.get(params.subscriptionId);
  const prorationBillingMode: ProrationBillingMode | null =
    getProrationBillingMode({
      oldSubPriceId: oldSub.items[0].price.id,
      newSubPriceId: body.priceId,
    });

  try {
    const subs = await paddle.subscriptions.update(params.subscriptionId, {
      items: [
        {
          priceId: body.priceId,
          quantity: 1,
        },
      ],
      prorationBillingMode: prorationBillingMode || undefined,
      // customData: {
      //   prorationBillingMode,
      //   teamId: params.teamId
      // }
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
