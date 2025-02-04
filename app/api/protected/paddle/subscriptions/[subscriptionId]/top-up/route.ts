import { NextRequest, NextResponse } from "next/server";
import {
  Environment,
  LogLevel,
  Paddle,
} from "@paddle/paddle-node-sdk";
// import { changeTokenLedgerMovementSubscription } from "@/lib/data/tokenLedger";

export async function POST(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  if (!process.env.PADDLE_API_KEY) {
    return new NextResponse("Paddle API Key is required", {
      status: 400,
    });
  }

  const body = await request.json();
  console.log({ body: JSON.stringify(body) }, params.subscriptionId);

  const paddle = new Paddle(process.env.PADDLE_API_KEY, {
    environment: Environment.sandbox, // or Environment.sandbox for accessing sandbox API
    logLevel: LogLevel.verbose, // or 'error' for less verbose logging
  });

  const cycleSubscription = await prisma?.subscriptionCycle.findFirst({
    where: {
      subscriptionId: params.subscriptionId,
      startOfCycle: {
        lte: new Date(),
      },
      endOfCycle: {
        gte: new Date(),
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const getMessagesQuantity = await prisma?.message.count({
    where: {
      createdAt: {
        gte: cycleSubscription?.startOfCycle,
        lte: cycleSubscription?.endOfCycle,
      },
    },
  });

  console.log({ cycleSubscription, getMessagesQuantity }, );

  if ((cycleSubscription?.maxCredits || 0) < ((getMessagesQuantity ?? 0) || 0)) {
    // TODO update
    await paddle.subscriptions.createOneTimeCharge(
      params.subscriptionId,
      {
        items: [
          {
            priceId: body.priceId,
            quantity: 1,
          },
        ],
        effectiveFrom: "immediately",
      }
    );
  }

  try {
    // const subs = await paddle.subscriptions.createOneTimeCharge(params.subscriptionId, {
    //   items: [
    //     {
    //       priceId: body.priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   prorationBillingMode,
    // });

    return new NextResponse(JSON.stringify("subs"), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    return new NextResponse("Failed patching team", {
      status: 500,
    });
  }
}
