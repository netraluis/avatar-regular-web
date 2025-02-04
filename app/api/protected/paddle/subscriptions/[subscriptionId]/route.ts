import { NextRequest, NextResponse } from "next/server";
import {
  Environment,
  LogLevel,
  Paddle,
  ProrationBillingMode,
} from "@paddle/paddle-node-sdk";
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
  { params }: { params: { subscriptionId: string } },
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
  let prorationBillingMode: ProrationBillingMode | null = null;
  if (oldSub.items[0].price.id === process.env.HOBBY_PRICE_ID) {
    if (
      body.priceId === process.env.STANDARD_PRICE_ID ||
      body.priceId === process.env.UNLIMITED_PRICE_ID
    ) {
      prorationBillingMode = "prorated_immediately";
    }
  }

  if (oldSub.items[0].price.id === process.env.STANDARD_PRICE_ID) {
    if (body.priceId === process.env.HOBBY_PRICE_ID) {
      prorationBillingMode = "full_next_billing_period";
    }
    if (body.priceId === process.env.UNLIMITED_PRICE_ID) {
      prorationBillingMode = "prorated_immediately";
    }
  }

  if (oldSub.items[0].price.id === process.env.UNLIMITED_PRICE_ID) {
    if (body.priceId === process.env.HOBBY_PRICE_ID) {
      prorationBillingMode = "full_next_billing_period";
    }
    if (body.priceId === process.env.STANDARD_PRICE_ID) {
      prorationBillingMode = "full_next_billing_period";
    }
  }

  if (prorationBillingMode === null) {
    return new NextResponse("Invalid subscription change", {
      status: 400,
    });
  }


  try {
    const subs = await paddle.subscriptions.update(params.subscriptionId, {
      items: [
        {
          priceId: body.priceId,
          quantity: 1,
        },
      ],
      prorationBillingMode,
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
